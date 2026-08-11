import mongoose from "mongoose";

import AppError from "../../errors/AppError.js";

import Like from "./like.model.js";
import Post from "../posts/post.model.js";

import {
  createNotificationService,
} from "../notification/notification.service.js";

export const toggleLikeService = async (
  userId,
  postId
) => {
  // Check whether the post exists
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(
      "Post not found",
      404
    );
  }

  // Check whether the user already liked the post
  const existingLike = await Like.findOne({
    user: userId,
    post: postId,
  });

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    // =================================
    // UNLIKE
    // =================================

    if (existingLike) {
      await Like.deleteOne(
        {
          user: userId,
          post: postId,
        },
        { session }
      );

      await Post.findByIdAndUpdate(
        postId,
        {
          $inc: {
            likeCount: -1,
          },
        },
        { session }
      );

      await session.commitTransaction();

      return {
        liked: false,
        likeCount: post.likeCount - 1,
      };
    }

    // =================================
    // LIKE
    // =================================

    await Like.create(
      [
        {
          user: userId,
          post: postId,
        },
      ],
      { session }
    );

    await Post.findByIdAndUpdate(
      postId,
      {
        $inc: {
          likeCount: 1,
        },
      },
      { session }
    );

    // Don't notify the user if
    // they liked their own post
    if (
      post.author.toString() !==
      userId.toString()
    ) {
      await createNotificationService({
        recipient: post.author,
        sender: userId,
        type: "LIKE",
        post: postId,
        session,
      });
    }

    await session.commitTransaction();

    return {
      liked: true,
      likeCount: post.likeCount + 1,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};