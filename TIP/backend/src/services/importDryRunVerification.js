import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { importCsv } from "./importService.js";

function csvRow(index, phone = String(2000000000 + index)) {
  return `First${index},Last${index},${phone},person${index}@example.com,1 Main St,Springfield,CA,90210,2026-01-01`;
}

function csvWithRows(rows) {
  return [
    "First Name,Last Name,Phone,Email,Address,City,State,ZIP,Record Date",
    ...rows
  ].join("\n");
}

function multipartRequest({ csv, fields = {}, headerDryRun = false }) {
  const boundary = "tip-dry-run-boundary";
  const parts = Object.entries(fields).map(([name, value]) => (
    `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
  ));
  parts.push(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="leads.csv"\r\nContent-Type: text/csv\r\n\r\n${csv}\r\n`
  );
  parts.push(`--${boundary}--\r\n`);

  const req = Readable.from(parts);
  req.headers = {
    "content-type": `multipart/form-data; boundary=${boundary}`
  };
  if (headerDryRun) req.headers["x-tip-dry-run"] = "true";
  return req;
}

function baseFields(overrides = {}) {
  return {
    mapping: JSON.stringify({
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      email: "Email",
      address: "Address",
      city: "City",
      state: "State",
      zip: "ZIP",
      recordDate: "Record Date"
    }),
    duplicateStrategy: "keep_first",
    dryRun: "true",
    vendorName: "Verify",
    ...overrides
  };
}

async function verifyRowCount(count) {
  const rows = Array.from({ length: count }, (_, index) => csvRow(index + 1));
  const result = await importCsv(multipartRequest({
    csv: csvWithRows(rows),
    fields: baseFields()
  }));
  assert.equal(result.dryRun, true);
  assert.equal(result.batchId, null);
  assert.equal(result.summary.totalRecords, count);
  assert.equal(result.summary.imported, count);
  assert.equal(result.summary.rejected, 0);
  assert.equal(result.summary.duplicateSkipped, 0);
}

async function verifyDuplicateStrategies() {
  const rows = [
    csvRow(1, "5551112222"),
    csvRow(2, "5551112222"),
    csvRow(3, "5553334444")
  ];

  const keepFirst = await importCsv(multipartRequest({
    csv: csvWithRows(rows),
    fields: baseFields({ duplicateStrategy: "keep_first" })
  }));
  assert.equal(keepFirst.summary.imported, 2);
  assert.equal(keepFirst.summary.duplicateSkipped, 1);
  assert.equal(keepFirst.summary.duplicatePhones, 2);

  const keepAll = await importCsv(multipartRequest({
    csv: csvWithRows(rows),
    fields: baseFields({ duplicateStrategy: "keep_all" })
  }));
  assert.equal(keepAll.summary.imported, 3);
  assert.equal(keepAll.summary.duplicateSkipped, 0);
  assert.equal(keepAll.summary.duplicatePhones, 2);
}

async function verifyInvalidReasons() {
  const rows = [
    "Bad,Phone,abc,bad@example.com,1 Main St,Springfield,XX,12,2026-01-01",
    csvRow(2, "5553334444")
  ];
  const result = await importCsv(multipartRequest({
    csv: csvWithRows(rows),
    fields: baseFields(),
    headerDryRun: true
  }));
  assert.equal(result.summary.totalRecords, 2);
  assert.equal(result.summary.imported, 1);
  assert.equal(result.summary.rejected, 1);
  assert.equal(result.summary.rejectionReasons["Phone is missing or is not a valid US phone number."], 1);
  assert.equal(result.summary.rejectionReasons["ZIP is missing or is not at least 5 digits."], 1);
  assert.equal(result.summary.rejectionReasons["State is missing or is not a valid US state."], 1);
}

async function verifyMissingMappingError() {
  await assert.rejects(
    () => importCsv(multipartRequest({
      csv: csvWithRows([csvRow(1)]),
      fields: baseFields({ mapping: JSON.stringify({ zip: "ZIP" }) }),
      headerDryRun: true
    })),
    /Phone column mapping is required/
  );
}

await verifyRowCount(2000);
await verifyRowCount(5000);
await verifyRowCount(100000);
await verifyDuplicateStrategies();
await verifyInvalidReasons();
await verifyMissingMappingError();

console.log("Import dry-run verification passed.");
