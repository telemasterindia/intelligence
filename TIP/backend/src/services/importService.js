import Busboy from "busboy";
import { parse } from "csv-parse";
import {
  createImportBatch,
  createImportStage,
  ensureVendor,
  getImportableCount,
  getImportSummary,
  insertStageRows,
  persistImport,
  streamExport,
  withImportClient
} from "../repositories/importRepository.js";
import {
  getDataAgeBucket,
  normalizePhone,
  normalizeState,
  normalizeZip,
  parseRecordDate,
  validateNormalizedRecord
} from "../utils/importNormalization.js";

const FLUSH_SIZE = 1000;
const DUPLICATE_STRATEGIES = new Set(["keep_first", "keep_latest", "keep_all"]);

function fieldValue(row, mapping, field) {
  const header = mapping[field];
  return header ? String(row[header] ?? "").trim() : "";
}

function mapCsvRow(row, rowNumber, mapping) {
  const phoneRaw = fieldValue(row, mapping, "phone");
  const stateRaw = fieldValue(row, mapping, "state");
  const zipRaw = fieldValue(row, mapping, "zip");
  const recordDate = parseRecordDate(fieldValue(row, mapping, "recordDate"));
  const normalized = {
    phoneNormalized: normalizePhone(phoneRaw),
    stateNormalized: normalizeState(stateRaw),
    zipNormalized: normalizeZip(zipRaw)
  };
  const validationErrors = validateNormalizedRecord(normalized);

  return {
    rowNumber,
    firstName: fieldValue(row, mapping, "firstName"),
    lastName: fieldValue(row, mapping, "lastName"),
    phoneRaw,
    phoneNormalized: normalized.phoneNormalized,
    email: fieldValue(row, mapping, "email"),
    address: fieldValue(row, mapping, "address"),
    city: fieldValue(row, mapping, "city"),
    stateRaw,
    stateNormalized: normalized.stateNormalized,
    zipRaw,
    zipNormalized: normalized.zipNormalized,
    recordDate,
    dataAgeBucket: getDataAgeBucket(recordDate),
    vendor: fieldValue(row, mapping, "vendor"),
    isValid: validationErrors.length === 0,
    validationErrors,
    rawPayload: row
  };
}

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function parseMappingField(value) {
  if (!value) throw createParseError("Column mapping is required before the CSV file is uploaded.");
  try {
    return JSON.parse(value);
  } catch {
    throw createParseError("Column mapping must be valid JSON.");
  }
}

function parseBooleanField(value) {
  return value === "true" || value === true;
}

function buildBatchName(vendorName, recordCount) {
  const vendor = (vendorName?.trim() || "CSV Import")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "CSV_Import";
  const date = new Date().toISOString().slice(0, 10);
  return `${vendor}_${date}_${recordCount}`;
}

function readUploadRequest(req, client) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    let fileName = "uploaded.csv";
    let filePromise = null;

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (_name, file, info) => {
      fileName = info.filename || fileName;
      filePromise = processCsvFile({ file, fields, client });
    });

    busboy.on("error", reject);
    busboy.on("finish", async () => {
      try {
        if (!filePromise) throw new Error("No CSV file was uploaded.");
        const result = await filePromise;
        resolve({ ...result, fileName });
      } catch (error) {
        reject(error);
      }
    });

    req.pipe(busboy);
  });
}

function readImportRequest(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    let fileName = "uploaded.csv";
    let filePromise = null;
    const headerDryRun = req.headers["x-tip-dry-run"] === "true";

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (_name, file, info) => {
      fileName = info.filename || fileName;
      try {
        const mapping = parseMappingField(fields.mapping);
        if (!mapping.phone) {
          throw createParseError("Phone column mapping is required before running an import or dry run.");
        }

        if (headerDryRun || parseBooleanField(fields.dryRun)) {
          filePromise = processDryRunFile({ file, fields });
        } else {
          filePromise = withImportClient((client) => processAndPersistImport({ client, file, fields, fileName }));
        }
      } catch (error) {
        file.resume();
        filePromise = Promise.reject(error);
      }
    });

    busboy.on("error", reject);
    busboy.on("finish", async () => {
      try {
        if (!filePromise) throw createParseError("No CSV file was uploaded.");
        const result = await filePromise;
        resolve({ ...result, fileName });
      } catch (error) {
        reject(error);
      }
    });

    req.pipe(busboy);
  });
}

function createParseError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.expose = true;
  return error;
}

async function processCsvFile({ file, fields, client }) {
  const mapping = parseJsonField(fields.mapping, {});
  const duplicateStrategy = DUPLICATE_STRATEGIES.has(fields.duplicateStrategy)
    ? fields.duplicateStrategy
    : "keep_first";
  const vendorName = fields.vendorName?.trim() || "";
  const dryRun = parseBooleanField(fields.dryRun);
  const parser = file.pipe(parse({ bom: true, columns: true, skip_empty_lines: true, relax_column_count: true, trim: true }));
  let rowNumber = 0;
  let chunk = [];

  await createImportStage(client);

  try {
    for await (const row of parser) {
      rowNumber += 1;
      chunk.push(mapCsvRow(row, rowNumber, mapping));
      if (chunk.length >= FLUSH_SIZE) {
        await insertStageRows(client, chunk);
        chunk = [];
      }
    }
  } catch (error) {
    throw createParseError(`CSV parsing failed: ${error.message}`);
  }

  await insertStageRows(client, chunk);
  return { duplicateStrategy, dryRun, vendorName };
}

async function processDryRunFile({ file, fields }) {
  const mapping = parseMappingField(fields.mapping);
  const duplicateStrategy = DUPLICATE_STRATEGIES.has(fields.duplicateStrategy)
    ? fields.duplicateStrategy
    : "keep_first";
  const vendorName = fields.vendorName?.trim() || "";
  const parser = file.pipe(parse({ bom: true, columns: true, skip_empty_lines: true, relax_column_count: true, trim: true }));
  const summary = createEmptySummary();
  const phones = new Map();
  const previewRows = [];
  const rejectionReasons = new Map();

  try {
    for await (const row of parser) {
      const rowNumber = summary.totalRecords + 1;
      const mapped = mapCsvRow(row, rowNumber, mapping);
      summary.totalRecords += 1;
      if (previewRows.length < 25) previewRows.push(row);
      addAgeBucket(summary, mapped.dataAgeBucket);

      if (mapped.phoneNormalized) summary.validPhones += 1;
      else summary.invalidPhones += 1;
      if (!mapped.zipNormalized) summary.missingZip += 1;
      if (!mapped.stateNormalized) summary.missingState += 1;

      if (!mapped.isValid) {
        summary.rejected += 1;
        for (const reason of mapped.validationErrors) {
          rejectionReasons.set(reason, (rejectionReasons.get(reason) || 0) + 1);
        }
        continue;
      }

      const current = phones.get(mapped.phoneNormalized) || { count: 0 };
      current.count += 1;
      phones.set(mapped.phoneNormalized, current);
    }
  } catch (error) {
    throw createParseError(`CSV parsing failed: ${error.message}`);
  }

  for (const { count } of phones.values()) {
    if (count > 1) summary.duplicatePhones += count;
    if (duplicateStrategy === "keep_all") {
      summary.imported += count;
    } else {
      summary.imported += 1;
      summary.duplicateSkipped += count - 1;
    }
  }

  summary.rejectionReasons = Object.fromEntries(rejectionReasons);

  return {
    batchName: buildBatchName(vendorName, summary.totalRecords),
    duplicateStrategy,
    dryRun: true,
    previewRows,
    summary,
    vendorName
  };
}

function createEmptySummary() {
  return {
    totalRecords: 0,
    imported: 0,
    rejected: 0,
    duplicateSkipped: 0,
    validPhones: 0,
    invalidPhones: 0,
    duplicatePhones: 0,
    missingZip: 0,
    missingState: 0,
    rejectionReasons: {},
    dataAgeDistribution: {
      under6Months: 0,
      sixToTwelveMonths: 0,
      oneToTwoYears: 0,
      twoPlusYears: 0,
      noDate: 0
    }
  };
}

function addAgeBucket(summary, bucket) {
  if (bucket === "under6Months") summary.dataAgeDistribution.under6Months += 1;
  if (bucket === "sixToTwelveMonths") summary.dataAgeDistribution.sixToTwelveMonths += 1;
  if (bucket === "oneToTwoYears") summary.dataAgeDistribution.oneToTwoYears += 1;
  if (bucket === "twoPlusYears") summary.dataAgeDistribution.twoPlusYears += 1;
  if (bucket === "noDate") summary.dataAgeDistribution.noDate += 1;
}

function shapeSummary(raw, imported) {
  const totalRecords = Number(raw.total_records || 0);
  const rejected = Number(raw.rejected || 0);
  const duplicateSkipped = Math.max(0, totalRecords - imported - rejected);
  return {
    totalRecords,
    imported,
    rejected,
    duplicateSkipped,
    validPhones: Number(raw.valid_phones || 0),
    invalidPhones: Number(raw.invalid_phones || 0),
    duplicatePhones: Number(raw.duplicate_phones || 0),
    missingZip: Number(raw.missing_zip || 0),
    missingState: Number(raw.missing_state || 0),
    rejectionReasons: raw.rejection_reasons || {},
    dataAgeDistribution: {
      under6Months: Number(raw.under_6_months || 0),
      sixToTwelveMonths: Number(raw.six_to_twelve_months || 0),
      oneToTwoYears: Number(raw.one_to_two_years || 0),
      twoPlusYears: Number(raw.two_plus_years || 0),
      noDate: Number(raw.no_date || 0)
    }
  };
}

export async function importCsv(req) {
  const result = await readImportRequest(req);
  if (result.dryRun) {
    return {
      batchId: null,
      batchName: result.batchName,
      dryRun: true,
      duplicateStrategy: result.duplicateStrategy,
      previewRows: result.previewRows,
      summary: result.summary
    };
  }

  return result;
}

async function processAndPersistImport({ client, file, fields, fileName }) {
  const upload = await processCsvFile({ file, fields, client });
  const rawSummary = await getImportSummary(client);
  const batchName = buildBatchName(upload.vendorName, Number(rawSummary.total_records || 0));
  const vendorId = await ensureVendor(client, upload.vendorName);
  const batchId = await createImportBatch(client, {
    vendorId,
    batchName,
    fileName
  });
  const imported = await persistImport(client, {
    batchId,
    vendorId,
    duplicateStrategy: upload.duplicateStrategy
  });

  return {
    batchId,
    batchName,
    dryRun: false,
    duplicateStrategy: upload.duplicateStrategy,
    summary: shapeSummary(rawSummary, imported)
  };
}

export function exportImportRecords({ batchId, type }, writable) {
  return streamExport({ batchId, type }, writable);
}
