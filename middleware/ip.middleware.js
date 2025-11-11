export const captureIP = (req, res, next) => {
  req.clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  next();
};

