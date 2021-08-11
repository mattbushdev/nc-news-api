const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query(`SELECT username FROM users;`);
  return rows;
};

exports.selectUserByUsername = async (username) => {
  const usernameExists = await checkUserExists(username);
  if (!usernameExists) {
    return Promise.reject({ status: 404, message: "username does not exist" });
  }

  const { rows } = await db.query(`SELECT * FROM users WHERE username=$1;`, [
    username,
  ]);
  return rows[0];
};

checkUserExists = async (username) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE username=$1;`, [
    username,
  ]);
  if (rows.length === 0) return false;
  return true;
};
