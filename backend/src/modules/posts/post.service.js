import fs from "fs";
import cloudinary from "../../config/cloudinary.js";

import AppError from "../../errors/AppError.js";
import Post from "./post.model.js";

import { toPostDTO } from "./post.dto.js";

import {
  uploadImagesToCloudinary,
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