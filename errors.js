exports.handleRouter404s = (req, res, next) => {
  res.status(404).send({ message: "invalid path" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(500).send({ message: "internal server error" });
  }
};
