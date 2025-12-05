import { Recipe } from '../db/models/recipe.js'

export async function createRecipe(
  userId,
  { title, ingredients, imageUrl, tags },
) {
  const recipe = new Recipe({
    title,
    author: userId,
    ingredients,
    imageUrl,
    tags,
  })
  return await recipe.save()
}

async function listRecipes(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Recipe.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllRecipes(options) {
  return await listRecipes({}, options)
}
export async function listRecipesByAuthor(authorId, options) {
  return await listRecipes({ author: authorId }, options)
}

export async function listRecipesByTag(tags, options) {
  return await listRecipes({ tags }, options)
}

export async function getRecipeById(recipeId) {
  return await Recipe.findById(recipeId)
}

export async function updateRecipe(
  userId,
  recipeId,
  { title, ingredients, imageUrl, tags },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    { $set: { title, ingredients, imageUrl, tags } },
    { new: true },
  )
}

export async function deleteRecipe(userId, recipeId) {
  return await Recipe.deleteOne({ _id: recipeId, author: userId })
}
