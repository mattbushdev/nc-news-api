const db = require("../db/connection");

exports.removeCommentById = async (comment_id) => {
  const commentExists = await checkCommentExists(comment_id);
  if (!commentExists) {
    return Promise.reject({
      status: 404,
      message: "comment id does not exist",
    });
  }

  const { rows } = await db.query(`DELETE FROM comments WHERE comment_id=$1`, [
    comment_id,
  ]);

  return rows;
};

checkCommentExists = async (comment_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE comment_id=$1;`,
    [comment_id]
  );
  if (rows.length === 0) return false;
  return true;
};
