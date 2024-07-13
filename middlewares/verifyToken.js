import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
    const accesstoken = req.cookies.token;

    console.log("Access Token =", accesstoken);

    if (!accesstoken) {
        // Set default values when no token is provided
        req.userid = 'default_user_id';
        req.useremail = 'default_user_email';
        console.log("No access token provided. Using default values.");
        return next();
    }

    jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            // Set default values when token verification fails
            req.userid = 'default_user_id';
            req.useremail = 'default_user_email';
            console.log("Token verification failed. Using default values.");
            return next();
        }

        req.userid = decode.userid;
        req.useremail = decode.useremail;

        next();
    });
}
