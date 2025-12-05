import { QueryClient, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { createRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CreateRecipe() {
  const [token] = useAuth()
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const queryClient = new QueryClient()
  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe(token, {
        title,
        ingredients: ingredients
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        imageUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      setTitle('')
      setIngredients('')
      setImageUrl('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
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
        placeholder='Enter one ingredient per line'
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <br />
      <div>
        <label htmlFor='create-url'>Image Url(Optional): </label>
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
      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || createRecipeMutation.isPending}
      />
      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Post created successfully!
        </>
      ) : null}
    </form>
  )
}
