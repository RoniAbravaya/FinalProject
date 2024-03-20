import { register, login, allusers } from "../models/users.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const _logout = (req,res) => {
    res.clearCookie("token");
    req.userid = null;
    req.useremail = null;
    res.senStatus(200);
}


export const _allusers = async (req,res)  => {
    try{
        console.log(req);
        const users = await allusers();
        res.json(users);

    }catch {
        console.log(error);
        res.status(404).json({ msg: "Something went wrong" });
    }
}

export const _login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await login(email.toLowerCase());

        if (user.length === 0)
            return res.status(404).json({ msg: "email not found" });

         const match = bcrypt.compareSync(password + "", user[0].password)
        
         if(!match) return res.status(404).json({ msg: "wrong password" });

        const userId = user[0].id;
        const useremail = user[0].email;

        const secret = process.env.ACCESS_TOKEN_SECERT;

        const accesstoken = jwt.sign({ userId, useremail}, secret, {
            expiresIn:"60s"
        });

        res.cookie("token",accesstoken, {
            maxAge:60 * 1000,
            httponly: true,
        });

        res.json({token:accesstoken});

    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: "Something went wrong" });
    }
}

export const _register = async (req, res) => {
    const { email, password } = req.body;
    const loweremail = email.toLowerCase();

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password + "", salt);

    try {
        const user = await register(loweremail, hash);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: "email exist" });
    }
}
