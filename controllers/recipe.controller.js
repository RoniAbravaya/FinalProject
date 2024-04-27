import { createRecipe, deleteRecipe, editRecipe, searchRecipe, getAllRecipes,getRecipesByUserId, getRecipesByUserEmail } from "../models/recipemodels.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
dotenv.config();

// Function to create a new recipe
export const _createRecipe = async (req, res) => {
  const { recipeName, ingredients, instructions, userId } = req.body;
  
  try {
    const recipe = await createRecipe(recipeName, ingredients, instructions, userId);
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to create recipe' });
  }
};

// Function to delete a recipe
export const _deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  
  try {
    const deleted = await deleteRecipe(recipeId);

    if (deleted) {
      res.json({ msg: 'Recipe deleted successfully' });
    } else {
      res.status(404).json({ msg: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to delete recipe' });
  }
};

// Function to edit a recipe
export const _editRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const { recipeName, ingredients, instructions } = req.body;
  
  try {
    const updated = await editRecipe(recipeId, recipeName, ingredients, instructions);

    if (updated) {
      res.json({ msg: 'Recipe updated successfully' });
    } else {
      res.status(404).json({ msg: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to update recipe' });
  }
};

// Function to search for recipes
export const _searchRecipe = async (req, res) => {
  const { keyword } = req.query;
  
  try {
    const recipes = await searchRecipe(keyword);
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to search for recipes' });
  }
};

// Function to get all recipes
export const _getAllRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipes(); // Remove 'res' argument from here
    console.log(req);
    
    const recipeArray = Array.isArray(recipes) ? recipes : [recipes];

    
    return recipes;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to get all recipes' });
  }
};



// Function to get recipes by user ID
export const _getRecipesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params; // Accessing user_id from req.params

    if (!user_id) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const recipes = await getRecipesByUserId(user_id);
    const recipeArray = Array.isArray(recipes) ? recipes : [recipes];
    
    res.json(recipeArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to get recipes by user ID' });
  }
};

// Function to get recipes by user email
export const _getRecipesByUserEmail = async (req, res, next) => {
  try {
    const { user_email } = req.params; // Accessing user_email from req.params

    if (!user_email) {
      return res.status(400).json({ msg: 'User email is required' });
    }

    const recipes = await getRecipesByUserEmail(user_email);
    const recipeArray = Array.isArray(recipes) ? recipes : [recipes];
    
    res.json(recipeArray);
    next
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to get recipes by user email' });
  }
};


