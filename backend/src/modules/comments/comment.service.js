import mongoose from "mongoose";

import AppError from "../../errors/AppError.js";

import Comment from "./comment.model.js";
import Post from "../posts/post.model.js";

import {
  createNotificationService,
} from "../notification/notification.service.js";


export const createCommentService = async (
  userId,
  postId,
  text
) => {
  // Validate comment text
  if (!text?.trim()) {
    throw new AppError(
      "Comment cannot be empty",
      400
    );
  }

  // Check whether post exists
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(
      "Post not found",
      404
    );
  }

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    // Create comment
    const [comment] =
      await Comment.create(
        [
          {
            user: userId,
            post: postId,
            text: text.trim(),
          },
        ],
        { session }
      );

    // Increase comment count
    await Post.findByIdAndUpdate(
      postId,
      {
        $inc: {
          commentCount: 1,
        },
      },
      { session }
    );

    // Don't notify yourself
    if (
      post.author.toString() !==
      userId.toString()
    ) {
      await createNotificationService({
        recipient: post.author,
        sender: userId,
        type: "COMMENT",
        post: postId,
        comment: comment._id,
        session,
      });
    }

    await session.commitTransaction();

    return comment;

  } catch (error) {
    await session.abortTransaction();

    throw error;

  } finally {
    await session.endSession();
  }
};

  

export const getCommentsService = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comments = await Comment.find({
    post: postId,
  })
    .populate(
      "user",
      "username displayName profileImage"
    )
    .sort({
      createdAt: -1,
    });

  return comments;
};

export const deleteCommentService = async (
  userId,
  commentId
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(
      "Comment not found",
      404
    );
  }

  // Only the person who created the comment
  // can delete it
  if (
    comment.user.toString() !==
    userId.toString()
  ) {
    throw new AppError(
      "You are not authorized to delete this comment",
      403
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Comment.deleteOne(
      {
        _id: commentId,
      },
      { session }
    );

    await Post.findByIdAndUpdate(
      comment.post,
      {
        $inc: {
          commentCount: -1,
        },
      },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};