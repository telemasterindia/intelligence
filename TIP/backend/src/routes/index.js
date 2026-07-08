import { Router } from "express";
import { foundationRoutes } from "./foundationRoutes.js";
import { healthRoutes } from "./healthRoutes.js";
import { importRoutes } from "./importRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/foundation", foundationRoutes);
apiRoutes.use("/imports", importRoutes);
