import express from "express";
import { _createRecipe, _deleteRecipe, _editRecipe, _searchRecipe, _getAllRecipes } from "../controllers/recipe.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

router.post(`/create`, verifyToken, _createRecipe);
router.delete(`/:recipeId`, verifyToken, _deleteRecipe);
router.put(`/:recipeId`, verifyToken, _editRecipe);
router.get(`/search`, verifyToken, (req, res) => {
    const { keyword } = req.query;
    _searchRecipe(keyword)
        .then(recipe => res.json(recipe))
        .catch(error => res.status(500).json({ msg: 'Failed to search for recipes' }));
});
router.get(`/all`,verifyToken , (req, res) => {
    _getAllRecipes()
        .then(recipe => res.json(recipe))
        .catch(error => res.status(500).json({ msg: 'Failed to get all recipes' }));
});

router.get(`/verify`,verifyToken , (req,res) => {

    const userId = req.userid;
    const useremail = req.useremail;

    const secret = process.env.ACCESS_TOKEN_SECERT;

    const accesstoken = jwt.sign({ userId, useremail}, secret, {
        expiresIn:"60s"
    });

    res.cookie("token",accesstoken, {
        maxAge:60 * 1000,
        httponly: true,
    });

    res.json({token:accesstoken});

    // res.sendStatus(200);
});

export default router;
