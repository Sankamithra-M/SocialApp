export const toPostDTO = (post) => ({
  id: post._id,
  author: post.author,
  caption: post.caption,
  images: post.images,
  likeCount: post.likeCount,
  commentCount: post.commentCount,
  isEdited: post.isEdited,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});