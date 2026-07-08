export function getHealth(_req, res) {
  res.json({
    service: "TIP API",
    status: "ok",
    version: "0.1.0"
  });
}
