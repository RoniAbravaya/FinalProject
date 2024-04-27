import { db } from "../config/db.js";

export const createRecipe = (recipeName, ingredients, instructions, user_email) => {
    return db("recipe").insert({ recipe_name: recipeName, ingredients, instructions, user_email }, ['recipe_id', 'recipe_name']);
};

export const deleteRecipe = (recipeId) => {
    return db("recipe").where({ recipe_id: recipeId }).del();
};

export const editRecipe = (recipeId, recipeName, ingredients, instructions ,likes) => {
    return db("recipe")
        .where({ recipe_id: recipeId })
        .update({ recipe_name: recipeName, ingredients, instructions , likes });
};

export const searchRecipe = (keyword) => {
    return db("recipe").select('*').where('recipe_name', 'ilike', `%${keyword}%`);
};

export const getAllRecipes = () => {
    return db("recipe").select('*');
};

export const getRecipesByUserId = (recipe_id) => {
    return db("recipe").select('*').where({recipe_id : recipe_id });
};


export const getRecipesByUserEmail = (user_email) => {
    return db("recipe").select('*').where('user_email', '=', user_email);
};
