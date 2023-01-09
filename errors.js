const loggerInstance = require("./logger");

const logger = loggerInstance.newLogger("errorHandler");

exports.handleRouter404s = (req, res, next) => {
  logger.error(`${err.statusCode} ${req.method} ${req.url}`);
  res.status(404).send({ message: "invalid path" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    logger.error(`${err.statusCode} ${req.method} ${req.url}`);
    res.status(400).send({ message: "invalid input" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  logger.error(`${err.statusCode || 500} ${req.method} ${req.url}`);
  res.status(err.status || 500).send({ message: err.message });
};
