import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usersRouter from './routes/users.router.js';
import recipeRouter from './routes/recipe.router.js';
import bodyParser from "body-parser";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, User_Email");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, User_Email");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});




dotenv.config();
// app.use(cors(corsOptions));
// app.use(cors([{credentials:true, origin: 'http://localhost:5173', headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Content-Type": "application/json",
//   },}]));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


app.listen(process.env.PORT || 3001, () => {
    console.log('running on port', process.env.PORT || 3001);
});

app.use("/users", usersRouter);
app.use("/recipes", recipeRouter);

