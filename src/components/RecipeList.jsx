import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Recipe } from './Recipe.jsx'
import { deleteRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function RecipeList({ recipes = [] }) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (recipeId) => deleteRecipe(token, recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })

  let userIdFromToken = null
  if (token) {
    try {
      const decoded = jwtDecode(token)
      userIdFromToken =
        decoded._id || decoded.sub || decoded.userId || decoded.id || null
    } catch (err) {
      console.error('Failed to decode JWT token:', err)
      userIdFromToken = null
    }
  }
  return (
    <div>
      {recipes.map((recipe) => {
        const authorId =
          typeof recipe.author === 'string' ? recipe.author : recipe.author?._id
        const deletable = !!userIdFromToken && userIdFromToken === authorId
        return (
          <Fragment key={recipe._id}>
            <Recipe
              key={recipe._id}
              {...recipe}
              canDelete={deletable}
              onDelete={() => deleteMutation.mutate(recipe._id)}
              deleteDisabled={deleteMutation.isPending}
            />
            <hr />
          </Fragment>
        )
      })}
    </div>
  )
}
RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape(Recipe.propTypes)).isRequired,
}
