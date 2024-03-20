import jwt from 'jsonwebtoken';
import { decode } from 'punycode';

// sign( {payload}, secre-code , {expire-time} )

// const token = jwt.sign(
//     {email:'test@test.com', userid: 16},
//     "123456",
//     {expiresIn:"1d"}
// );


// console.log(token);

const myToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VyaWQiOjE2LCJpYXQiOjE3MTAxNzUyNTIsImV4cCI6MTcxMDI2MTY1Mn0.0FEANpPFC5zQ8NhZ6LTJe2TX64dt9qUFKsTbj2MAWtE";

jwt.verify(myToken, "123456",(err, decode) => {
    if(err) return console.log(err.message);

    console.log(decode);
});


