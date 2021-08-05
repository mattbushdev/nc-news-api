const express = require("express");
const {
  handleRouter404s,
  handlePSQLErrors,
  handleBadRequests,
} = require("./errors");
const apiRouter = require("./routers/api.router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleRouter404s);

app.use(handlePSQLErrors);

app.use(handleBadRequests);

app.use((err, req, res, next) => {
  // console.log(err);
});
module.exports = app;
