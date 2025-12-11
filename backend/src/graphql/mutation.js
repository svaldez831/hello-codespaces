import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost, updatePost, deletePost } from '../services/posts.js'

export const mutationSchema = `#graphql
    type Mutation {
      signupUser(username: String!, password: String!): User
      loginUser(username: String!, password: String!): String
      createPost(
        title: String!
        contents: [String!]
        imageUrl: String
        tags: [String]
        ): Post

      updatePost(
        id: ID!
        title: String
        contents: [String!]
        imageUrl: String
        tags:[String] 
      ) : Post
      deletePost(id:ID!): Boolean!
    }
`

export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password })
    },

    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password })
    },

    createPost: async (
      parent,
      { title, contents, imageUrl, tags },
      { auth },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }
      return await createPost(auth.sub, { title, contents, imageUrl, tags })
    },
    updatePost: async (
      parent,
      { id, title, contents, imageUrl, tags },
      { auth },
    ) => {
      if (!auth) {
        throw new GraphQLError('You need to be logged in to do this', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      const post = await updatePost(auth.sub, id, {
        title,
        contents,
        imageUrl,
        tags,
      })
      if (!post) {
        throw new GraphQLError('Post not found.', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      return post
    },
    deletePost: async (parent, { id }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action. ',
          {
            extensions: { code: 'UNAUTHORIZED' },
          },
        )
      }
      const { deletedCount } = await deletePost(auth.sub, id)
      if (deletedCount === 0) {
        throw new GraphQLError('Post not found. ', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      return true
    },
  },
}
