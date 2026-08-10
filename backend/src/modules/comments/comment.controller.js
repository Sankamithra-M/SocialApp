import asyncHandler from "../../middleware/asyncHandler.js";

import { createCommentService , getCommentsService , deleteCommentService } from "./comment.service.js";

export const createComment = asyncHandler(
  async (req, res) => {
    const comment = await createCommentService(
      req.user._id,
      req.params.postId,
      req.body.text
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  }
);

export const getComments = asyncHandler(
  async (req, res) => {
    const comments = await getCommentsService(
      req.params.postId
    );

    res.status(200).json({
      success: true,
      data: comments,
    });
  }
);

export const deleteComment = asyncHandler(
  async (req, res) => {
    await deleteCommentService(
      req.user._id,
      req.params.commentId
    );

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
);