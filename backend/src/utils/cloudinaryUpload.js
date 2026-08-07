import { promises as fs } from "fs";

import cloudinary from "../config/cloudinary.js";
import AppError from "../errors/AppError.js";

export const uploadImagesToCloudinary = async (
  files,
  folder
) => {
  const uploadResults = await Promise.allSettled(
    files.map(async (file) => {
      try {
        const uploadResult =
          await cloudinary.uploader.upload(file.path, {
            folder,
          });

        return {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        };
      } finally {
        try {
          await fs.unlink(file.path);
        } catch (error) {
          console.error(
            `Failed to delete local file: ${file.path}`,
            error
          );
        }
      }
    })
  );

  const successfulUploads = uploadResults
    .filter(
      (result) => result.status === "fulfilled"
    )
    .map((result) => result.value);

  const hasFailedUploads = uploadResults.some(
    (result) => result.status === "rejected"
  );

  if (hasFailedUploads) {
    await deleteImagesFromCloudinary(
      successfulUploads
    );

    throw new AppError(
      "Failed to upload one or more images",
      500
    );
  }

  return successfulUploads;
};

export const deleteImagesFromCloudinary = async (
  images
) => {
  if (!images?.length) {
    return;
  }

  const deleteResults = await Promise.allSettled(
    images.map((image) =>
      cloudinary.uploader.destroy(image.publicId)
    )
  );

  const failedDeletes = deleteResults.filter(
    (result) => result.status === "rejected"
  );

  if (failedDeletes.length > 0) {
    console.error(
      "Cloudinary cleanup failed",
      failedDeletes
    );
  }
};