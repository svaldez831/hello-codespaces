import { Like } from '../db/models/like.js'
import { requireAuth } from '../middleware/jwt.js'

export function likeRoutes(app) {
  app.post('/api/v1/posts/:id/like', requireAuth, async (req, res) => {
    const userId = req.auth.sub
    const postId = req.params.id
    try {
      await Like.updateOne(
        { user: userId, post: postId },
        { $setOnInsert: { user: userId, post: postId } },
        { upsert: true },
      )
      return res.status(204).end()
    } catch (err) {
      console.error('Error liking post', err)
      return res.status(500).end()
    }
  })

  app.delete('/api/v1/posts/:id/like', requireAuth, async (req, res) => {
    const userId = req.auth.sub
    const postId = req.params.id

    try {
      await Like.deleteOne({ user: userId, post: postId })
      return res.status(204).end()
    } catch (err) {
      console.error('error unliking post', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/posts/:id/likesCount', async (req, res) => {
    const postId = req.params.id

    try {
      const count = await Like.countDocuments({ post: postId })
      return res.json({ likesCount: count })
    } catch (err) {
      console.error('error getting likes count', err)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/posts/:id/likedByMe', requireAuth, async (req, res) => {
    const userId = req.auth.sub
    const postId = req.params.id

    try {
      const like = await Like.findOne({ user: userId, post: postId })
      return res.json({ liked: !!like })
    } catch (err) {
      console.error('error checking likedByMe', err)
      return res.status(500).end()
    }
  })
}
