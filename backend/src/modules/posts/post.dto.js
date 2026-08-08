export const toPostDTO = (post) => ({
  id: post._id,
  caption: post.caption,
  images: post.images,
  likeCount: post.likeCount,
  commentCount: post.commentCount,
  isEdited: post.isEdited,
  createdAt: post.createdAt,

  author: {
    id: post.author._id,
    username: post.author.username,
    displayName: post.author.displayName,
    profileImage: post.author.profileImage,
  },
});