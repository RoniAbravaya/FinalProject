import { db } from "../config/db.js";

export const createRecipe = (recipeName, ingredients, instructions, userId) => {
    return db("recipe").insert({ recipe_name: recipeName, ingredients, instructions, user_id: userId }, ['recipe_id', 'recipe_name']);
};

export const deleteRecipe = (recipeId) => {
    return db("recipe").where({ recipe_id: recipeId }).del();
};

export const editRecipe = (recipeId, recipeName, ingredients, instructions) => {
    return db("recipe")
        .where({ recipe_id: recipeId })
        .update({ recipe_name: recipeName, ingredients, instructions });
};

export const searchRecipe = (keyword) => {
    return db("recipe").select('*').where('recipe_name', 'ilike', `%${keyword}%`);
};

export const getAllRecipes = () => {
    return db("recipe").select('*');
};

export const getRecipesByUserId = (user_id) => {
    return db("recipe").select('*').where({user_id : user_id });
};


export const getRecipesByUserEmail = (user_email) => {
    return db("recipe").select('*').where('user_email', '=', user_email);
};
