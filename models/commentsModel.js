const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

const commentModel = mongoose.model("Comments", commentSchema);

module.exports = commentModel;
