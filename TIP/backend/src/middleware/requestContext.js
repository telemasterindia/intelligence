import crypto from "node:crypto";

export function requestContext(req, _res, next) {
  req.context = {
    requestId: crypto.randomUUID(),
    startedAt: new Date()
  };
  next();
}
