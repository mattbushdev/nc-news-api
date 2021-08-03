const express = require("express");
const apiRouter = require("./api.router");
const app = express();

app.use(express.json());
app.use("/api", apiRouter);
module.exports = app;
