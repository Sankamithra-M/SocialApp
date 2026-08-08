import asyncHandler from "../../middleware/asyncHandler.js";

import { createPostService , getUserPostsService , deletePostService} from "./post.service.js";

export const createPost = asyncHandler(
  async (req, res) => {
    const post = await createPostService(
      req.user._id,
      req.body.caption,
      req.files
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  }
);

export const getUserPosts = asyncHandler(
  async (req, res) => {
    const posts =
      await getUserPostsService(
        req.params.username
      );

    res.status(200).json({
      success: true,
      data: posts,
    });
  }
);


export const deletePost = asyncHandler(
  async (req, res) => {
    await deletePostService(
      req.user._id,
      req.params.postId
    );

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  }
);