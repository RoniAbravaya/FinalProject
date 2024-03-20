import express from "express";
import { _login, _register, _allusers ,_logout } from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();


router.post(`/register`, _register);
router.post(`/login`,_login);
router.get(`/`, verifyToken ,_allusers);
router.get(`/logout`, _logout);
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