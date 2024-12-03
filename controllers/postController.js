const Post = require("../models/Post");

// Add a New Post
const addPost = async (req, res) => {
  const { title, content, owner } = req.body;

  try {
    if (!title || !owner) {
      return res.status(400).json({ error: "Title and owner are required." });
    }

    const newPost = new Post({ title, content, owner });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating post." });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts." });
  }
};

// Get a Post by ID
const getPostById = async (req, res) => {
  const postId = req.params.post_id;

  try {
    const post = await Post.findById(postId).populate("comments");
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post." });
  }
};

// Get Posts by Sender
const getPostsBySender = async (req, res) => {
  const sender = req.query.sender;

  try {
    if (!sender) {
      return res.status(400).json({ error: "Sender ID is required in query parameter." });
    }

    const posts = await Post.find({ owner: sender }).populate("comments");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts by sender." });
  }
};

// Update a Post
const updatePost = async (req, res) => {
  const postId = req.params.post_id;
  const { title, content, owner } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, owner },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Error updating post." });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.post_id;

  try {
      // Find and delete the post
      const deletedPost = await PostModel.findByIdAndDelete(postId);

      if (!deletedPost) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getPostById,
  getPostsBySender,
  updatePost,
  deletePost
};
