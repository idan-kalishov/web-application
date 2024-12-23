import express, { Application } from "express";
import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes";
import commentsRouter from "./routes/commentsRoute";
import bodyParser from "body-parser";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/comments', commentsRouter);
app.use('/post', postRoutes);

// MongoDB connection
mongoose
  .connect(process.env.DB_CONNECT as string)
  .then(() => console.log("Connected to the database"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${ process.env.PORT}`));
