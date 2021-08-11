const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");
const { getApiJson } = require("../controllers/api.controllers");
const commentsRouter = require("./comments.router");

apiRouter.route("/").get(getApiJson);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
