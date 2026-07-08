import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";
import { apiRoutes } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.frontendUrl }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestContext);

  app.use("/api", apiRoutes);
  app.use(errorHandler);

  return app;
}
