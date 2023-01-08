const { db, logger } = require("../connection.js");
const format = require("pg-format");
const {
  formatTopicData,
  formatUserData,
  formatArticleData,
  formatCommentData,
} = require("../utils/data-manipulation");

const seed = async ({ articleData, commentData, topicData, userData }) => {
  try {
    logger.info(`Creating tables`);

    await db.query(`DROP TABLE IF EXISTS comments;`);
    await db.query(`DROP TABLE IF EXISTS articles;`);
    await db.query(`DROP TABLE IF EXISTS users;`);
    await db.query(`DROP TABLE IF EXISTS topics;`);

    await db.query(`CREATE TABLE topics (
    slug VARCHAR(100) PRIMARY KEY,
    description VARCHAR(250) NOT NULL
  );`);

    await db.query(`CREATE TABLE users (
    username VARCHAR(200) PRIMARY KEY,
    avatar_url VARCHAR(200) NOT NULL,
    name VARCHAR(100) NOT NULL
  );`);

    await db.query(`CREATE TABLE articles (
   article_id SERIAL PRIMARY KEY,
   title VARCHAR(200) NOT NULL,
   body VARCHAR(2000) NOT NULL,
   votes INT DEFAULT 0 NOT NULL,
   topic VARCHAR(100) REFERENCES topics(slug) NOT NULL,
   author VARCHAR(100) REFERENCES users(username) NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );`);

    await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR(100) REFERENCES users(username) NOT NULL,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    body VARCHAR(2000) NOT NULL
      );`);

    const topicDataInsert = format(
      `INSERT INTO topics 
  (slug, description)
  VALUES %L RETURNING *;`,
      formatTopicData(topicData)
    );

    const topicDataResult = await db.query(topicDataInsert);

    const userDataInsert = format(
      `INSERT INTO users
    (username, avatar_url, name)
    VALUES %L RETURNING *;`,
      formatUserData(userData)
    );

    const userDataResult = await db.query(userDataInsert);

    const articleDataInsert = format(
      `INSERT INTO articles
    (title, body, votes, topic, author, created_at)
    VALUES %L RETURNING *;`,
      formatArticleData(articleData)
    );

    const articleDataResult = await db.query(articleDataInsert);

    const commentDataInsert = format(
      `INSERT INTO comments
    (author, article_id, votes, created_at, body)
    VALUES %L RETURNING *;`,
      formatCommentData(commentData, articleDataResult.rows)
    );

    const commentDataResult = await db.query(commentDataInsert);
  } catch (err) {
    logger.error(err);
  }
};

module.exports = seed;
