import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { updateRecipe } from '../api/recipes.js'

export function Recipe({
  _id,
  title,
  ingredients,
  imageUrl,
  author: userId,
  canDelete,
  onDelete,
  deleteDisabled,
}) {
  const PLACE_HOLDER_IMAGE_URL =
    'https://www.foodservicerewards.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781'
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editImageUrl, setEditImageUrl] = useState(imageUrl || '')
  const [editedIngredients, setEditedIngredients] = useState(
    Array.isArray(ingredients) ? ingredients.join('\n') : ingredients || '',
  )
  const updateMutation = useMutation({
    mutationFn: () =>
      updateRecipe(token, _id, {
        title: editedTitle,
        imageUrl: editImageUrl,
        ingredients: editedIngredients
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      setIsEditing(false)
    },
  })
  const handleEditSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate()
  }
  if (!isEditing) {
    return (
      <article>
        <h3>{title}</h3>
        <div>
          <img
            src={imageUrl || PLACE_HOLDER_IMAGE_URL}
            alt={title}
            width={100}
            height={100}
          />
        </div>
        <ul>
          {Array.isArray(ingredients) ? (
            ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))
          ) : (
            <li>{ingredients}</li>
          )}
        </ul>
        {userId && (
          <em>
            <br />
            Written by{' '}
            <strong>
              <User id={userId} />
            </strong>
          </em>
        )}

        {canDelete && (
          <>
            <br />
            <button
              type='button'
              onClick={() => setIsEditing(true)}
              disabled={updateMutation.isPending}
            >
              Edit Recipe
            </button>{' '}
            <button type='button' onClick={onDelete} disabled={deleteDisabled}>
              {deleteDisabled ? 'Deleting...' : 'Delete Recipe'}
            </button>
          </>
        )}
      </article>
    )
  }
  return (
    <article>
      <h3>Edit Recipe</h3>
      <form onSubmit={handleEditSubmit}>
        <div>
          <label htmlFor={`edit-title-${_id}`}>Title:</label>
          <input
            type='text'
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`edit-image-${_id}`}>Image URL:</label>
          <input
            type='text'
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`edit-image-${_id}`}>
            Ingredients (one per line):
          </label>
          <textarea
            value={editedIngredients}
            onChange={(e) => setEditedIngredients(e.target.value)}
          />
        </div>
        <button
          type='submit'
          disabled={updateMutation.isPending || !editedTitle.trim()}
        >
          {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
        </button>
        
        <button type='button' onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </article>
  )
}
Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  author: PropTypes.string,
  canDelete: PropTypes.bool,
  onDelete: PropTypes.func,
  deleteDisabled: PropTypes.bool,
}
