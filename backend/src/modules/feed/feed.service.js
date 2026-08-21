import Follow from "../follows/follow.model.js";
import Post from "../posts/post.model.js";

import { toPostDTO } from "../posts/post.dto.js";


// ========================================
// GET FEED
// ========================================

export const getFeedService = async (
  userId,
  cursor,
  limit = 20
) => {

  // ======================================
  // GET FOLLOWING USERS
  // ======================================

  const follows =
    await Follow.find({
      follower: userId,
    }).select("following");


  const followingIds =
    follows.map(
      (follow) => follow.following
    );


  // ======================================
  // BUILD POST QUERY
  // ======================================

  const query = {
    author: {
      $in: followingIds,
    },
  };


  // ======================================
  // CURSOR PAGINATION
  // ======================================

  if (cursor) {

    query.createdAt = {
      $lt: new Date(cursor),
    };

  }


  // ======================================
  // GET POSTS
  // ======================================

  const posts =
    await Post.find(query)
      .populate(
        "author",
        "username displayName profileImage"
      )
      .sort({
        createdAt: -1,
      })
      .limit(limit + 1);


  // ======================================
  // CHECK MORE POSTS
  // ======================================

  const hasMore =
    posts.length > limit;


  const postsToReturn =
    hasMore
      ? posts.slice(0, limit)
      : posts;


  // ======================================
  // NEXT CURSOR
  // ======================================

  const nextCursor =
    hasMore
      ? postsToReturn[
          postsToReturn.length - 1
        ].createdAt
      : null;


  // ======================================
  // RESPONSE
  // ======================================

  return {

    posts:
      postsToReturn.map(
        toPostDTO
      ),

    pagination: {

      nextCursor,

      hasMore,

    },

  };

};