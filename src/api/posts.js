export const getPosts = async (queryParams) => {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
    new URLSearchParams(queryParams)

  console.log('getPosts URL =>', url)

  const res = await fetch(url)

  const text = await res.text()
  console.log('getPosts status =>', res.status)
  console.log('getPosts content-type =>', res.headers.get('content-type'))
  console.log('getPosts first 120 chars =>', text.slice(0, 120))

  // Only parse JSON if it actually is JSON
  if (!res.ok) {
    throw new Error(`getPosts failed ${res.status}: ${text.slice(0, 200)}`)
  }

  return JSON.parse(text)
}

export const createPost = async (token, post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })
  return await res.json()
}

export const getPostById = async (postId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`)
  return await res.json()
}
