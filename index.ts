import express, { Application } from "express";
import mongoose from "mongoose";
import postRoutes from './src/routes/postRoutes';
import commentsRoutes from "./src/routes/commentsRoute";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes";
import dotenv from "dotenv"

const app: Application = express();
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/comments', commentsRoutes);
app.use('/posts', postRoutes);
app.use('/auth', authRoutes)

// MongoDB connection
if (!process.env.DB_CONNECT) {
    throw new Error('DB_CONNECT environment variable is not defined');
}

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to the database"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));


// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
