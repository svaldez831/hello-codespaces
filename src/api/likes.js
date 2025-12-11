const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const likePost = (postId, token) =>
  fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to like post: ${res.status}`)
    }
    // 204 No Content → nothing to parse
    return
  })

export const unlikePost = (postId, token) =>
  fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to unlike post: ${res.status}`)
    }
    return
  })

export const getLikesCount = (postId) =>
  fetch(`${BASE_URL}/posts/${postId}/likesCount`).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to get likes count: ${res.status}`)
    }
    return res.json() // { likesCount: number }
  })

export const getLikedByMe = (postId, token) =>
  fetch(`${BASE_URL}/posts/${postId}/likedByMe`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to check likedByMe: ${res.status}`)
    }
    return res.json() // { liked: boolean }
  })
