const db = require("../db/connection");
exports.selectTopics = async () => {
  const topicQuery = await db.query("SELECT * FROM topics;");
  return topicQuery.rows;
};
