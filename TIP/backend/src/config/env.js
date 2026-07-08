import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};

if (!env.databaseUrl) {
  console.warn("DATABASE_URL is not set. Database-backed routes will fail until configured.");
}
