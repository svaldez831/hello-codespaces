import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import slug from 'slug'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CreatePost() {
  const [token] = useAuth()

  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const contentList = contents
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const variables = {
      title,
      contents: contentList,
      imageUrl: imageUrl ?? '',
    }

    const context = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {}
    createPost({ variables, context })
  }
  if (!token) return <div>Please log in to create new posts.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <textarea
        value={contents}
        placeholder='Enter one ingredient per line'
        onChange={(e) => setContents(e.target.value)}
      />

      <div>
        <label htmlFor='create-url'>Image Url:(Optional) </label>
        <input
          type='text'
          name='create-url'
          id='create-url'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder='http://example.com/image.jpg'
        />
      </div>
      <br />
      <br />
      <input
        type='submit'
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {data?.createPost ? (
        <>
          <br />
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            {data.createPost.title}
          </Link>{' '}
          created successfully!
        </>
      ) : null}
    </form>
  )
}
