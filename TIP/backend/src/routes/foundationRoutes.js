import { Router } from "express";
import { getFoundationStatus } from "../controllers/foundationController.js";

export const foundationRoutes = Router();

foundationRoutes.get("/", getFoundationStatus);
