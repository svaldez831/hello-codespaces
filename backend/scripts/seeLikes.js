// scripts/seedLikes.js
import mongoose from 'mongoose'
import 'dotenv/config.js'
import { User } from '../src/db/models/user.js'
import { Post } from '../src/db/models/post.js'
import { Like } from '../src/db/models/like.js'

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('DATABASE_URL is not set in .env')
    process.exit(1)
  }

  console.log('Connecting to DB:', dbUrl)
  await mongoose.connect(dbUrl)

  // Grab any one user and a few posts
  const user = await User.findOne()
  if (!user) {
    console.error('No users found in database. Create a user first.')
    process.exit(1)
  }

  const posts = await Post.find().limit(3)
  if (posts.length === 0) {
    console.error('No posts found in database. Create some posts first.')
    process.exit(1)
  }

  console.log('Seeding likes for user:', user.username)
  console.log(
    'Post IDs:',
    posts.map((p) => p._id.toString()),
  )

  // Optional: clear existing likes so we know what's there
  await Like.deleteMany({ user: user._id })

  const docs = posts.map((post) => ({
    user: user._id,
    post: post._id,
  }))

  await Like.insertMany(docs)

  console.log(`Inserted ${docs.length} likes for ${user.username}`)

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
