import { detectCsvColumns } from "../services/csvDetectionService.js";
import { exportImportRecords, importCsv } from "../services/importService.js";

export async function detectColumns(req, res, next) {
  try {
    res.json(await detectCsvColumns(req));
  } catch (error) {
    next(error);
  }
}

export async function uploadImport(req, res, next) {
  try {
    res.status(201).json(await importCsv(req));
  } catch (error) {
    next(error);
  }
}

export async function exportRecords(req, res, next) {
  try {
    const { batchId, type } = req.params;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${type}-records-${batchId}.csv"`);
    await exportImportRecords({ batchId, type }, res);
    res.end();
  } catch (error) {
    next(error);
  }
}
