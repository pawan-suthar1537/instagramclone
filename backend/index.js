import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import { connectDB } from "./utils/Db.js";
import { errorHandlerMiddleware } from "./middlewares/customerror.js";

import userRoutes from "./routes/userroutes.js";

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

morgan.token("method", (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      return chalk.green(method);
    case "POST":
      return chalk.blue(method);
    case "PUT":
      return chalk.yellow(method);
    case "DELETE":
      return chalk.red(method);
    default:
      return method;
  }
});

const customMorganFormat =
  "method=>:method url=>:url status=>:status responseTime=>:response-time ms";
app.use(morgan(customMorganFormat));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the instaclone API",
  });
});

app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandlerMiddleware);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
