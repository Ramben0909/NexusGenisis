// middlewares/loggerMiddleware.js
export const requestLogger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next(); // continue to next middleware/route
};
