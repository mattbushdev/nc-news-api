const cors = require("cors");
const express = require("express");
const expressWinston = require("express-winston");
const {
  handleRouter404s,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./errors");
const apiRouter = require("./routers/api.router");
const loggerInstance = require("./logger");

const app = express();

app.use(cors());

app.use(express.json());

const logger = loggerInstance.newLogger("app");
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    colorize: false,
  })
);

app.use("/api", apiRouter);

app.use(handleRouter404s);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

module.exports = { app, logger };
