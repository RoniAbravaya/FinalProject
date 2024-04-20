import { createRecipe, deleteRecipe, editRecipe, searchRecipe, getAllRecipes } from "../models/recipemodels.js";
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
