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
    } else {
      console.log("should be here");
      return Promise.reject({
        status: 404,
        message: "comment does not exist",
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

exports.selectArticles = async (query) => {
  const { sort_by = "created_at", order = "desc", topic } = query;
  if (
    ![
      "author",
      "body",
      "created_at",
      "topic",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      message: "invalid sort by query",
    });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      message: "invalid order query",
    });
  }

  const queryValues = [];
  let queryStr = `SELECT articles.*, 
  COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id=articles.article_id
  `;

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  const { rows } = await db.query(queryStr, queryValues);
  if (rows.length === 0) {
    const topicExists = await checkTopicExists(topic);
    if (!topicExists) {
      return Promise.reject({
        status: 400,
        message: `invalid topic query, topic ${topic} does not exist`,
      });
    }
  }
  return rows;
};

exports.selectCommentsByArticleId = async (article_id) => {
  const response = await db.query(
    `
  SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body
  FROM comments
  INNER JOIN articles ON comments.article_id=articles.article_id
  WHERE comments.article_id=$1;`,
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
  return response.rows;
};

const checkArticleExists = async (article_id) => {
  const response = await db.query(
    "SELECT * FROM articles WHERE articles.article_id=$1",
    [article_id]
  );
  if (response.rows.length === 0) return false;
  return true;
};

const checkTopicExists = async (topic) => {
  const { rows } = await db.query(`SELECT * FROM topics WHERE slug=$1;`, [
    topic,
  ]);
  if (rows.length === 0) return false;
  return true;
};
