const db = require("../connection.js");
// const data = require("../data/development-data/index.js");

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
   created_at TIMESTAMP
    );`);

  console.log("articles table created");

  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR(20) REFERENCES users(username),
    article_id INT REFERENCES articles(article_id),
    votes INT DEFAULT 0,
    created_at TIMESTAMP,
    body TEXT NOT NULL
      );`);

  console.log("comments table created");

  await db.query(`INSERT INTO topics (slug)`);

  // 2. insert data
};

// seed().then((result) => {
//   console.log("anything here?");
// });

module.exports = seed;
