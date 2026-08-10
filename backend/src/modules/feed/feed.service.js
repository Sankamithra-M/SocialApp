import Follow from "../follows/follow.model.js";
import Post from "../posts/post.model.js";
import AppError from "../../errors/AppError.js";
import { toPostDTO } from "../posts/post.dto.js";


export const getFeedService = async (
  userId,
  cursor,
  limit = 10
) => {
  const follows = await Follow.find({
    follower: userId,
  }).select("following");

  const followingIds = follows.map(
    (follow) => follow.following
  );

  // Protect the API from huge requests
  limit = Math.min(Number(limit) || 10, 50);

  const query = {
    author: {
      $in: followingIds,
    },
  };

  // If cursor exists, get older posts
  if (cursor) {
    const cursorDate = new Date(cursor);

  if (Number.isNaN(cursorDate.getTime())) {
    throw new AppError(
      "Invalid feed cursor",
      400
    );
  }

    query.createdAt = {
      $lt: new Date(cursor),
    };
  }

  const posts = await Post.find(query)
    .populate(
      "author",
      "username displayName profileImage"
    )
    .sort({
      createdAt: -1,
    })
    .limit(limit + 1);

  const hasMore = posts.length > limit;

  const postsToReturn = hasMore
    ? posts.slice(0, limit)
    : posts;

  const nextCursor = hasMore
    ? postsToReturn[
        postsToReturn.length - 1
      ].createdAt
    : null;

  return {
    posts: postsToReturn.map(toPostDTO),
    pagination: {
      nextCursor,
      hasMore,
    },
  };
};