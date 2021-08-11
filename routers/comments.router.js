const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchVotesByCommentId,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchVotesByCommentId);

module.exports = commentsRouter;
