const express = require("express");
const {
  handleRouter404s,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./errors");
const apiRouter = require("./routers/api.router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleRouter404s);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

module.exports = app;
