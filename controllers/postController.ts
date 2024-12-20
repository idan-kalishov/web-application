import { Request, Response } from 'express';
import Post, { IPost } from '../models/Post';

const addPost = async (req: Request, res: Response): Promise<Response> => {
  const { title, content, owner } = req.body;

  try {
    if (!title || !owner) {
      return res.status(400).json({ error: 'Title and owner are required.' });
    }

    const newPost = new Post({ title, content, owner });
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating post.' });
  }
};

const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts: IPost[] = await Post.find().populate('comments');
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching posts.' });
  }
};

const getPostById = async (req: Request, res: Response): Promise<Response> => {
  const postId: string = req.params.post_id;

  try {
    const post = await Post.findById(postId).populate('comments');
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching post.' });
  }
};

const getPostsBySender = async (req: Request, res: Response): Promise<Response> => {
  const sender: string = req.query.sender as string;

  try {
    if (!sender) {
      return res.status(400).json({ error: 'Sender ID is required in query parameter.' });
    }

    const posts: IPost[] = await Post.find({ owner: sender }).populate('comments');
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching posts by sender.' });
  }
};

// Update a Post
const updatePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: string = req.params.post_id;
  const { title, content, owner } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, owner },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    return res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating post.' });
  }
};

// Delete a Post
const deletePost = async (req: Request, res: Response): Promise<Response> => {
  const postId: string = req.params.post_id;

  try {
    // Find and delete the post
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ message: 'Post deleted successfully', deletedPost });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  addPost,
  getAllPosts,
  getPostById,
  getPostsBySender,
  updatePost,
  deletePost
};
