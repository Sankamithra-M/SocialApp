import mongoose from "mongoose";

import AppError from "../../errors/AppError.js";

import Like from "./like.model.js";
import Post from "../posts/post.model.js";

export const toggleLikeService = async (
  userId,
  postId
) => {
  // Check whether the post exists
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Check whether the user already liked this post
  const existingLike = await Like.findOne({
    user: userId,
    post: postId,
  });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Already liked → Unlike
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

    // Not liked → Like
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