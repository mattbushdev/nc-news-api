const db = require("../connection.js");
const format = require("pg-format");
// const data = require("../data/development-data/index.js");
const {
  formatTopicsData,
  formatUsersData,
  formatArticleData,
  formatCommentData,
} = require("../utils/data-manipulation");
const seed = async ({ articleData, commentData, topicData, userData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  console.log("tables dropped");

  await db.query(`CREATE TABLE topics (
    slug TEXT PRIMARY KEY,
    description TEXT
  );`);

  console.log("topics table created");

  await db.query(`CREATE TABLE users (
    username TEXT PRIMARY KEY,
    avatar_url TEXT,
    name VARCHAR(100) NOT NULL
  );`);

  console.log("users table created");

  await db.query(`CREATE TABLE articles (
   article_id SERIAL PRIMARY KEY,
   title VARCHAR(100) NOT NULL,
   body TEXT NOT NULL,
   votes INT DEFAULT 0,
   topic TEXT REFERENCES topics(slug) NOT NULL,
   author VARCHAR(100) REFERENCES users(username),
   created_at TIMESTAMP DEFAULT NOW()
    );`);

  console.log("articles table created");

  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR(20) REFERENCES users(username),
    article_id INT REFERENCES articles(article_id),
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    body TEXT NOT NULL
      );`);

  console.log("comments table created");

  const topicDataInsert = format(
    `INSERT INTO topics 
  (slug, description)
  VALUES %L RETURNING *;`,
    formatTopicsData(topicData)
  );

  // 2. insert data
  const insertData = await db.query(topicDataInsert);

  //console.log(insertData.rows);

  const userDataInsert = format(
    `INSERT INTO users
    (username, avatar_url, name)
    VALUES %L RETURNING *;`,
    formatUsersData(userData)
  );

  const userInsertData = await db.query(userDataInsert);

  //console.log(userInsertData.rows);

  const articleDataInsert = format(
    `INSERT INTO articles
    (title, body, votes, topic, author, created_at)
    VALUES %L RETURNING *;`,
    formatArticleData(articleData)
  );

  const articleInsertData = await db.query(articleDataInsert);

  //COMMENTS
  const commentsDataInsert = format(
    `INSERT INTO comments
    (author, article_id, votes, created_at, body)
    VALUES %L RETURNING *;`,
    formatCommentData(commentData, articleInsertData.rows)
  );

  const commentInsertData = await db.query(commentsDataInsert);
  console.log(commentInsertData.rows);
};

module.exports = seed;
