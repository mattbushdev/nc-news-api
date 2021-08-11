const {
  removeCommentById,
  updateVotesByCommentId,
} = require("../models/comments.models");

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await removeCommentById(comment_id);
    res.send(204);
  } catch (err) {
    next(err);
  }
};

exports.patchVotesByCommentId = async (req, res, next) => {
  const { body } = req;
  const { comment_id } = req.params;
  try {
    const comment = await updateVotesByCommentId(body, comment_id);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
