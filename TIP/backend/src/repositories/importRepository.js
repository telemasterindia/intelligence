import crypto from "node:crypto";
import QueryStream from "pg-query-stream";
import { pool } from "../database/pool.js";

const BATCH_SIZE = 1000;

function makeVendorCode(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 36);
  return `${slug || "vendor"}_${crypto.randomUUID().slice(0, 8)}`;
}

function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function withImportClient(callback) {
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

export async function ensureVendor(client, vendorName) {
  const name = vendorName?.trim() || "CSV Import";
  const existing = await client.query("SELECT id FROM vendors WHERE lower(name) = lower($1)", [name]);
  if (existing.rowCount) return existing.rows[0].id;

  const created = await client.query(
    "INSERT INTO vendors (name, code, metadata) VALUES ($1, $2, $3) RETURNING id",
    [name, makeVendorCode(name), { source: "import_engine" }]
  );
  return created.rows[0].id;
}

export async function createImportBatch(client, { vendorId, batchName, fileName }) {
  const result = await client.query(
    `INSERT INTO import_batches (vendor_id, original_file_name, status, metadata)
     VALUES ($1, $2, 'processing', $3)
     RETURNING id`,
    [vendorId, batchName || fileName || "uploaded.csv", { source: "import_engine", batchName, sourceFileName: fileName }]
  );
  return result.rows[0].id;
}

export async function insertAuditEvent(client, { action, entityType, entityId, afterState = {}, metadata = {} }) {
  await client.query(
    `INSERT INTO audit_log (action, entity_type, entity_id, after_state, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [action, entityType, entityId, afterState, metadata]
  );
}

export async function createImportStage(client) {
  await client.query("DROP TABLE IF EXISTS import_stage");
  await client.query(`
    CREATE TEMP TABLE import_stage (
      row_number BIGINT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone_raw TEXT,
      phone_normalized TEXT,
      email TEXT,
      address_line1 TEXT,
      city TEXT,
      state_raw TEXT,
      state_normalized TEXT,
      zip_raw TEXT,
      zip_normalized TEXT,
      record_date TIMESTAMPTZ,
      data_age_bucket TEXT NOT NULL,
      vendor_name TEXT,
      is_valid BOOLEAN NOT NULL,
      validation_errors TEXT[] NOT NULL,
      raw_payload JSONB NOT NULL
    )
  `);
  await client.query("CREATE INDEX import_stage_phone_idx ON import_stage(phone_normalized)");
  await client.query("CREATE INDEX import_stage_valid_idx ON import_stage(is_valid)");
}

export async function insertStageRows(client, rows) {
  if (!rows.length) return;
  for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
    const chunk = rows.slice(offset, offset + BATCH_SIZE);
    const values = [];
    const placeholders = chunk.map((row, rowIndex) => {
      const base = rowIndex * 18;
      values.push(
        row.rowNumber,
        row.firstName,
        row.lastName,
        row.phoneRaw,
        row.phoneNormalized,
        row.email,
        row.address,
        row.city,
        row.stateRaw,
        row.stateNormalized,
        row.zipRaw,
        row.zipNormalized,
        row.recordDate,
        row.dataAgeBucket,
        row.vendor,
        row.isValid,
        row.validationErrors,
        row.rawPayload
      );
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14}, $${base + 15}, $${base + 16}, $${base + 17}, $${base + 18})`;
    });

    await client.query(
      `INSERT INTO import_stage (
        row_number, first_name, last_name, phone_raw, phone_normalized, email,
        address_line1, city, state_raw, state_normalized, zip_raw, zip_normalized,
        record_date, data_age_bucket, vendor_name, is_valid, validation_errors, raw_payload
      ) VALUES ${placeholders.join(", ")}`,
      values
    );
  }
}

export async function getImportSummary(client) {
  const result = await client.query(`
    WITH duplicate_rows AS (
      SELECT row_number
      FROM import_stage
      WHERE phone_normalized IN (
        SELECT phone_normalized
        FROM import_stage
        WHERE phone_normalized <> ''
        GROUP BY phone_normalized
        HAVING COUNT(*) > 1
      )
    )
    SELECT
      COUNT(*)::bigint AS total_records,
      COUNT(*) FILTER (WHERE is_valid = FALSE)::bigint AS rejected,
      COUNT(*) FILTER (WHERE phone_normalized <> '')::bigint AS valid_phones,
      COUNT(*) FILTER (WHERE phone_normalized = '')::bigint AS invalid_phones,
      COUNT(*) FILTER (WHERE zip_normalized = '')::bigint AS missing_zip,
      COUNT(*) FILTER (WHERE state_normalized = '')::bigint AS missing_state,
      (SELECT COUNT(*) FROM duplicate_rows)::bigint AS duplicate_phones,
      COUNT(*) FILTER (WHERE data_age_bucket = 'under6Months')::bigint AS under_6_months,
      COUNT(*) FILTER (WHERE data_age_bucket = 'sixToTwelveMonths')::bigint AS six_to_twelve_months,
      COUNT(*) FILTER (WHERE data_age_bucket = 'oneToTwoYears')::bigint AS one_to_two_years,
      COUNT(*) FILTER (WHERE data_age_bucket = 'twoPlusYears')::bigint AS two_plus_years,
      COUNT(*) FILTER (WHERE data_age_bucket = 'noDate')::bigint AS no_date,
      COALESCE(
        (
          SELECT jsonb_object_agg(reason, reason_count)
          FROM (
            SELECT unnest(validation_errors) AS reason, COUNT(*)::bigint AS reason_count
            FROM import_stage
            WHERE is_valid = FALSE
            GROUP BY reason
          ) reasons
        ),
        '{}'::jsonb
      ) AS rejection_reasons
    FROM import_stage
  `);
  return result.rows[0];
}

export async function getImportableCount(client, duplicateStrategy) {
  const result = await client.query(`
    WITH valid_rows AS (
      SELECT
        phone_normalized,
        record_date,
        row_number,
        COUNT(*) OVER (PARTITION BY phone_normalized) AS phone_count,
        ROW_NUMBER() OVER (
          PARTITION BY phone_normalized
          ORDER BY row_number ASC
        ) AS keep_first_rank,
        ROW_NUMBER() OVER (
          PARTITION BY phone_normalized
          ORDER BY record_date DESC NULLS LAST, row_number DESC
        ) AS keep_latest_rank
      FROM import_stage
      WHERE is_valid = TRUE
    )
    SELECT COUNT(*)::bigint AS count
    FROM valid_rows
    WHERE
      phone_count = 1
      OR $1 = 'keep_all'
      OR ($1 = 'keep_latest' AND keep_latest_rank = 1)
      OR ($1 <> 'keep_latest' AND $1 <> 'keep_all' AND keep_first_rank = 1)
  `, [duplicateStrategy]);
  return Number(result.rows[0]?.count || 0);
}

export async function persistImport(client, { batchId, vendorId, duplicateStrategy }) {
  await client.query("BEGIN");
  try {
    await client.query("DROP TABLE IF EXISTS import_selected");
    await client.query(`
      CREATE TEMP TABLE import_selected AS
      WITH valid_rows AS (
        SELECT *,
          COUNT(*) OVER (PARTITION BY phone_normalized) AS phone_count,
          ROW_NUMBER() OVER (
            PARTITION BY phone_normalized
            ORDER BY row_number ASC
          ) AS keep_first_rank,
          ROW_NUMBER() OVER (
            PARTITION BY phone_normalized
            ORDER BY record_date DESC NULLS LAST, row_number DESC
          ) AS keep_latest_rank
        FROM import_stage
        WHERE is_valid = TRUE
      )
      SELECT *,
        CASE
          WHEN phone_count = 1 THEN TRUE
          WHEN $1 = 'keep_all' THEN TRUE
          WHEN $1 = 'keep_latest' THEN keep_latest_rank = 1
          ELSE keep_first_rank = 1
        END AS should_import,
        phone_count > 1 AS is_duplicate
      FROM valid_rows
    `, [duplicateStrategy]);

    await client.query(`
      INSERT INTO lead_identities (phone_normalized, phone_hash, metadata)
      SELECT DISTINCT phone_normalized, phone_hash, $1::jsonb
      FROM (
        SELECT phone_normalized, encode(sha256(phone_normalized::bytea), 'hex') AS phone_hash
        FROM import_selected
        WHERE should_import = TRUE
      ) identities
      ON CONFLICT (phone_normalized) DO NOTHING
    `, [{ source: "import_engine" }]);

    await client.query(`
      INSERT INTO leads (
        import_batch_id, vendor_id, lead_identity_id, source_row_number,
        first_name, last_name, phone_e164, email, address_line1, city,
        status, raw_payload
      )
      SELECT
        $1, $2, li.id, s.row_number, s.first_name, s.last_name, s.phone_normalized,
        NULLIF(s.email, ''), s.address_line1, s.city, 'new',
        s.raw_payload || jsonb_build_object(
          'normalized_state', s.state_normalized,
          'normalized_zip', s.zip_normalized,
          'record_date', s.record_date,
          'data_age_bucket', s.data_age_bucket,
          'row_vendor', s.vendor_name
        )
      FROM import_selected s
      JOIN lead_identities li ON li.phone_normalized = s.phone_normalized
      WHERE s.should_import = TRUE
    `, [batchId, vendorId]);

    await client.query(`
      INSERT INTO import_validations (import_batch_id, row_number, reason, severity, original_json)
      SELECT $1, row_number, array_to_string(validation_errors, ' | '), 'error', raw_payload
      FROM import_stage
      WHERE is_valid = FALSE
    `, [batchId]);

    await client.query(`
      INSERT INTO import_validations (import_batch_id, row_number, reason, severity, original_json)
      SELECT $1, row_number, 'Duplicate phone excluded by selected duplicate handling.', 'warning', raw_payload
      FROM import_selected
      WHERE is_duplicate = TRUE AND should_import = FALSE
    `, [batchId]);

    const imported = await client.query("SELECT COUNT(*)::bigint AS count FROM import_selected WHERE should_import = TRUE");
    await client.query(
      `UPDATE import_batches
       SET status = 'completed',
           total_rows = (SELECT COUNT(*) FROM import_stage),
           accepted_rows = $2,
           rejected_rows = (SELECT COUNT(*) FROM import_validations WHERE import_batch_id = $1),
           imported_at = NOW(),
           metadata = metadata || $3::jsonb,
           updated_at = NOW()
       WHERE id = $1`,
      [batchId, imported.rows[0].count, { duplicateStrategy }]
    );

    await insertAuditEvent(client, {
      action: "import.completed",
      entityType: "import_batch",
      entityId: batchId,
      afterState: { acceptedRows: Number(imported.rows[0].count) },
      metadata: { source: "import_engine" }
    });

    await client.query("COMMIT");
    return Number(imported.rows[0].count);
  } catch (error) {
    await client.query("ROLLBACK");
    await client.query("UPDATE import_batches SET status = 'failed', updated_at = NOW() WHERE id = $1", [batchId]);
    await insertAuditEvent(client, {
      action: "import.failed",
      entityType: "import_batch",
      entityId: batchId,
      afterState: { status: "failed", error: error.message },
      metadata: { source: "import_engine" }
    });
    throw error;
  }
}

export async function streamExport({ batchId, type }, writable) {
  const client = await pool.connect();
  const queries = {
    clean: {
      headers: ["row_number", "first_name", "last_name", "phone", "email", "address", "city", "raw_payload"],
      sql: `SELECT source_row_number, first_name, last_name, phone_e164, email, address_line1, city, raw_payload
            FROM leads WHERE import_batch_id = $1 ORDER BY source_row_number`
    },
    duplicate: {
      headers: ["row_number", "reason", "original_json"],
      sql: `SELECT row_number, reason, original_json
            FROM import_validations
            WHERE import_batch_id = $1 AND reason = 'Duplicate phone excluded by selected duplicate handling.'
            ORDER BY row_number`
    },
    invalid: {
      headers: ["row_number", "reason", "original_json"],
      sql: `SELECT row_number, reason, original_json
            FROM import_validations
            WHERE import_batch_id = $1 AND reason <> 'Duplicate phone excluded by selected duplicate handling.'
            ORDER BY row_number`
    }
  };
  const exportQuery = queries[type];
  if (!exportQuery) throw new Error("Unsupported export type.");

  writable.write(`${exportQuery.headers.join(",")}\n`);
  const stream = client.query(new QueryStream(exportQuery.sql, [batchId]));

  return new Promise((resolve, reject) => {
    stream.on("data", (row) => {
      writable.write(`${Object.values(row).map((value) => escapeCsv(typeof value === "object" ? JSON.stringify(value) : value)).join(",")}\n`);
    });
    stream.on("end", () => {
      client.release();
      resolve();
    });
    stream.on("error", (error) => {
      client.release();
      reject(error);
    });
  });
}
