const db = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  const response = await db.query(
    `SELECT articles.*, 
    COUNT(comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id=articles.article_id 
    WHERE articles.article_id=$1 
    GROUP BY articles.article_id;`,
    [article_id]
  );

  if (response.rows.length === 0) {
    const articleExists = await checkArticleExists(article_id);
    if (!articleExists) {
      return Promise.reject({
        status: 404,
        message: "article id does not exist",
      });
    }
  }
  return response.rows[0];
};

exports.updateArticleById = async (article_id, body) => {
  const { inc_votes } = body;
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      message: "inc_votes not in request body",
    });
  } else if (Object.keys(body).length > 1) {
    return Promise.reject({
      status: 400,
      message: "invalid property in request body",
    });
  } else {
    const response = await db.query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    );
    return response.rows[0];
  }
};

const checkArticleExists = async (article_id) => {
  const response = await db.query(
    "SELECT * FROM articles WHERE articles.article_id=$1",
    [article_id]
  );
  if (response.rows.length === 0) return false;
  return true;
};
