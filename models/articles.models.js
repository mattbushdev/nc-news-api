const db = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  // const invalidArticleId =

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

const checkArticleExists = async (article_id) => {
  const response = await db.query(
    "SELECT * FROM articles WHERE articles.article_id=$1",
    [article_id]
  );
  if (response.rows.length === 0) return false;
  return true;
};
