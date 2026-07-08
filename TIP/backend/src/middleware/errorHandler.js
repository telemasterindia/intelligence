export function errorHandler(error, _req, res, _next) {
  console.error(error);

  res.status(error.statusCode || 500).json({
    error: {
      message: error.expose ? error.message : "Internal server error"
    }
  });
}
