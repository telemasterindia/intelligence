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

  for await (const row of parser) {
    rowNumber += 1;
    chunk.push(mapCsvRow(row, rowNumber, mapping));
    if (chunk.length >= FLUSH_SIZE) {
      await insertStageRows(client, chunk);
      chunk = [];
    }
  }

  await insertStageRows(client, chunk);
  return { duplicateStrategy, dryRun, vendorName };
}

function shapeSummary(raw, imported) {
  return {
    totalRecords: Number(raw.total_records || 0),
    imported,
    validPhones: Number(raw.valid_phones || 0),
    invalidPhones: Number(raw.invalid_phones || 0),
    duplicatePhones: Number(raw.duplicate_phones || 0),
    missingZip: Number(raw.missing_zip || 0),
    missingState: Number(raw.missing_state || 0),
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
  return withImportClient(async (client) => {
    const upload = await readUploadRequest(req, client);
    const rawSummary = await getImportSummary(client);
    const batchName = buildBatchName(upload.vendorName, Number(rawSummary.total_records || 0));
    const importableCount = await getImportableCount(client, upload.duplicateStrategy);

    if (upload.dryRun) {
      return {
        batchId: null,
        batchName,
        dryRun: true,
        duplicateStrategy: upload.duplicateStrategy,
        summary: shapeSummary(rawSummary, importableCount)
      };
    }

    const vendorId = await ensureVendor(client, upload.vendorName);
    const batchId = await createImportBatch(client, {
      vendorId,
      batchName,
      fileName: upload.fileName
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
  });
}

export function exportImportRecords({ batchId, type }, writable) {
  return streamExport({ batchId, type }, writable);
}
