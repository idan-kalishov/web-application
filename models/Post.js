const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  owner: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
});

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
