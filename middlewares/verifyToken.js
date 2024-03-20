import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res , next) => {
    const accesstoken = req.cookies.token;

    console.log("Access Token =", accesstoken);

    if (!accesstoken) return res.status(401).json( {msg: `unautorized`});

    jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECERT , (err,decode) => {
        if(err) return res.status(403).json( {msg: `forbiden`});
        req.userid = decode.userid;
        req.useremail = decode.useremail;

        next();
    });
}
