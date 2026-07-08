import { Router } from "express";
import { detectColumns, exportRecords, uploadImport } from "../controllers/importController.js";

export const importRoutes = Router();

importRoutes.post("/detect-columns", detectColumns);
importRoutes.post("/", uploadImport);
importRoutes.get("/:batchId/export/:type", exportRecords);
