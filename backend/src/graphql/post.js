import { getUserInfoById } from '../services/users.js'
import { getLikesCount } from '../services/likes.js'

export const postSchema = `#graphql
  type Post {
    id: ID!
    title: String!
    author: User
    contents: [String!]
    tags: [String!]
    createdAt: Float
    updatedAt: Float
    likesCount: Int!
    imageUrl: String
  }
`

export const postResolver = {
  Post: {
    author: async (post) => {
      return await getUserInfoById(post.author)
    },
    likesCount: async (post) => {
      const { likesCount } = await getLikesCount(post._id)
      return likesCount
    },
  },
}
