import { CreatePost } from './components/CreatePost.jsx'
import { PostList } from './components/PostList.jsx'
import { PostFilter } from './components/PostFilter.jsx'
import { PostSorting } from './components/PostSorting.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from './api/posts.js'

export function Blog() {
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts({}),
  })
  const posts = postsQuery.data ?? []

  return (
    <div style={{ padding: 8 }}>
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter field='author' />
      <br />
      <PostSorting fields={['createdAt', 'updatedAt']} />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}

export default Blog
