import { useState } from 'react'
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { Helmet } from 'react-helmet-async'
import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { GET_POSTS, GET_POSTS_BY_AUTHOR } from '../api/graphql/posts.js'
import { NavigationBridge } from '../NavigationBridge.jsx'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useGraphQLQuery(author ? GET_POSTS_BY_AUTHOR : GET_POSTS, {
    variables: { author, options: { sortBy, sortOrder } },
  })
  const posts = postsQuery.data?.postsByAuthor ?? postsQuery.data?.posts ?? []
  const sortedPosts =
    sortBy === 'likesCount'
      ? [...posts].sort((a, b) => {
          if (sortOrder === 'descending') {
            return b.likesCount - a.likesCount
          } else {
            return a.likesCount - b.likesCount
          }
        })
      : posts
  return (
    <div style={{ padding: 8 }}>
      <NavigationBridge />
      <Helmet>
        <title> RECIPE BLOG </title>
        <meta
          name='description'
          content='A blog full of articles about full-stack React development.'
        />
      </Helmet>
      <Header />
      <br />
      <hr />
      <br />
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt', 'likesCount']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={sortedPosts} />
    </div>
  )
}
