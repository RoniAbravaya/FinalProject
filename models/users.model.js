import { db } from "../config/db.js";

export const register = (email, password) => {
    return db("users").insert({email,password}, ['id','email']);
};


export const login = (email) => {
    return db("users").select('id','email','password').where({ email })
}

export const allusers = () => {
    return db("users").select('id','email','password');
}