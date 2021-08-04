const {
  selectArticleById,
  updateArticleById,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  try {
    const article = await updateArticleById(article_id, body);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
