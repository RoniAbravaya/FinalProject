import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usersRouter from './routes/users.router.js';
import recipeRouter from './routes/recipe.router.js';
import bodyParser from "body-parser";

const app = express();

app.use(cors({
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'User_Email'],
  credentials: true
}));

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, User_Email');
  res.sendStatus(200);
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


app.listen(process.env.PORT || 3001, () => {
    console.log('running on port', process.env.PORT || 3001);
});

app.use("/users", usersRouter);
app.use("/recipes", recipeRouter);

