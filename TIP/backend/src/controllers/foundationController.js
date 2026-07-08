import { moduleRegistry } from "../config/modules.js";

export function getFoundationStatus(_req, res) {
  res.json({
    platform: "TeleMaster Intelligence Platform",
    phase: "Sprint 0",
    featuresEnabled: false,
    modules: moduleRegistry
  });
}
