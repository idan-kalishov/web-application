const express = require("express");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postRoutes");
const commentsRouter = require("./routes/commentsRoute");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

app.use(bodyParser.json());

app.use('/comments', commentsRouter);

mongoose
  .connect("mongodb://localhost:27017/web-application", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.error("MongoDB connection error:", err));

  app.use("/post", postRoutes);


app.listen(3000, () => console.log(`Server running on http://localhost:3000`));
