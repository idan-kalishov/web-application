import express, { Application } from "express";
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
  .connect("mongodb://localhost:27017/web-application")
  .then(() => console.log("Connected to the database"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
