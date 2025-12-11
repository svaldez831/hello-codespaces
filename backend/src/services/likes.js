import { Like } from '../db/models/like.js'

/**
 * Create or ensure a like exists for (user, post).
 * Simple CRUD: "create" (or ignore if already exists).
 */
export async function likePost({ userId, postId }) {
  // upsert ensures no duplicate like, thanks to unique index
  await Like.updateOne(
    { user: userId, post: postId },
    { $setOnInsert: { user: userId, post: postId } },
    { upsert: true },
  )

  // Optional: return the like doc if you want
  return await Like.findOne({ user: userId, post: postId })
}

/**
 * Remove a like for (user, post).
 * Simple CRUD: "delete".
 */
export async function unlikePost({ userId, postId }) {
  return await Like.deleteOne({ user: userId, post: postId })
}

/**
 * Get total likes count for a post.
 * Simple CRUD: "read".
 */
export async function getLikesCount(postId) {
  const likesCount = await Like.countDocuments({ post: postId })
  return { likesCount }
}

/**
 * Check if this specific user has liked this post.
 * Simple CRUD: "read".
 */
export async function getLikedByUser({ userId, postId }) {
  if (!userId) return { liked: false }

  const like = await Like.findOne({ user: userId, post: postId })
  return { liked: !!like }
}
