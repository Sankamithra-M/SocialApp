import fs from "fs";
import cloudinary from "../../config/cloudinary.js";
import User from "../users/user.model.js";
import AppError from "../../errors/AppError.js";
import Post from "./post.model.js";

import { toPostDTO } from "./post.dto.js";

import {
  uploadImagesToCloudinary, deleteImagesFromCloudinary
} from "../../utils/cloudinaryUpload.js";

const validateCreatePost = (caption, files) => {
  const hasCaption = caption?.trim();
  const hasImages = files?.length > 0;

  if (!hasCaption && !hasImages) {
    throw new AppError(
      "Post must contain a caption or at least one image",
      400
    );
  }
  if (files && files.length > 10) {
  throw new AppError(
    "Maximum 10 images allowed",
    400
  );
}
};
export const createPostService = async (
  userId,
  caption,
  files
) => {
  validateCreatePost(caption, files);

  const uploadedImages =
    await uploadImagesToCloudinary(
      files,
      "social-app/posts"
    );

  const post = await Post.create({
    author: userId,
    caption: caption?.trim() || "",
    images: uploadedImages,
  });

  return toPostDTO(post);
};

export const getUserPostsService = async (
  username
) => {
  // Find the user
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // Find all posts
  const posts = await Post.find({
    author: user._id,
  })
    .populate(
      "author",
      "username displayName profileImage"
    )
    .sort({
      createdAt: -1,
    });

  return posts.map(toPostDTO);
};

export const deletePostService = async (
  userId,
  postId
) => {
  // Find the post
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(
      "Post not found",
      404
    );
  }

  // Verify ownership
  if (
    post.author.toString() !==
    userId.toString()
  ) {
    throw new AppError(
      "You are not authorized to delete this post",
      403
    );
  }

  // Delete all post images from Cloudinary
  await deleteImagesFromCloudinary(post.images);

  // Delete the post from MongoDB
  await post.deleteOne();
};