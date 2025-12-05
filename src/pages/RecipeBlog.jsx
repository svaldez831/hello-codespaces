import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeList } from '../components/RecipeList.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { getRecipes } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode'

export function RecipeBlog() {
  const [token] = useAuth()
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterText, setFilterText] = useState('')
  const [filterField, setFilterField] = useState('title')
  const author = token ? jwtDecode(token).sub : undefined

  const recipeQuery = useQuery({
    queryKey: ['recipes', { author: author ?? null, sortBy, sortOrder }],
    queryFn: () => {
      const params = { sortBy, sortOrder }
      if (author) {
        params.author = author
      }
      return getRecipes(params)
    },
  })
  const recipes = recipeQuery.data ?? []

  let visibleRecipes = recipes
  if (!token && filterText) {
    const search = filterText.toLowerCase()
    visibleRecipes = recipes.filter((recipe) => {
      if (filterField === 'title') {
        return recipe.title.toLowerCase().includes(search)
      }
      if (filterField === 'ingredients') {
        if (Array.isArray(recipe.ingredients)) {
          return recipe.ingredients.some((ing) =>
            ing.toLowerCase().includes(search),
          )
        }

        return recipe.ingredients.toLowerCase().includes(search)
      }

      if (filterField === 'tags') {
        if (Array.isArray(recipe.tags)) {
          return recipe.tags.some((tag) => tag.toLowerCase().includes(search))
        }

        return recipe.tags?.toLowerCase().includes(search)
      }

      return true
    })
  }

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <hr />
      <CreateRecipe />
      <br />
      <hr />
      {author ? (
        <div>
          <p>showing Only Recipes</p>
        </div>
      ) : (
        <div>
          <p> Showing all recipes. Filter by:</p>
          <div>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            >
              <option value='title'>Title</option>
              <option value='ingredients'>Ingredients</option>
            </select>
          </div>
          <RecipeFilter
            field='title'
            value={filterText}
            onChange={setFilterText}
          />
        </div>
      )}
      <RecipeSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <RecipeList recipes={visibleRecipes} />
    </div>
  )
}

export default RecipeBlog
