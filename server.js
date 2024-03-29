import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usersrouter from './routes/users.router.js'

const app = express();

const corsOptions = {
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

dotenv.config();
app.use(cors(corsOptions));
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

app.use("/users",usersrouter);
