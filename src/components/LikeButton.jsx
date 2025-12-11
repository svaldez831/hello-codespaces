// src/components/LikeButton.jsx
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  likePost,
  unlikePost,
  getLikesCount,
  getLikedByMe,
} from '../api/likes.js'

export function LikeButton({ postId, className = '' }) {
  const [token] = useAuth()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)

        const { likesCount } = await getLikesCount(postId)
        if (!cancelled) setLikesCount(likesCount)

        if (token) {
          const { liked } = await getLikedByMe(postId, token)
          if (!cancelled) setLiked(liked)
        } else {
          if (!cancelled) setLiked(false)
        }
      } catch (err) {
        console.error('Error loading likes info', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [postId, token])

  const handleToggle = async () => {
    if (!token) {
      alert('Please log in to like posts.')
      return
    }

    try {
      setToggling(true)

      if (liked) {
        await unlikePost(postId, token)
        setLiked(false)
        setLikesCount((c) => Math.max(0, c - 1))
      } else {
        await likePost(postId, token)
        setLiked(true)
        setLikesCount((c) => c + 1)
      }
    } catch (err) {
      console.error('Error toggling like', err)
    } finally {
      setToggling(false)
    }
  }

  if (loading) {
    return <span className={className}>Likes: …</span>
  }

  return (
    <span className={className}>
      <button type='button' onClick={handleToggle} disabled={toggling}>
        {liked ? 'Unlike' : 'Like'}
      </button>{' '}
      <span>Likes: {likesCount}</span>
    </span>
  )
}

LikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
  className: PropTypes.string,
}
