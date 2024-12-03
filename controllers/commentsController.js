const CommentModel = require('../models/commentsModel');
const Post = require("../models/Post");

// Get all comments
const getAllComments = async (req, res) => {
    try {
        const comments = await CommentModel.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a comment by its ID
const getCommentById = async (req, res) => {
    const commentId = req.params.comment_id;
    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comments by postId
const getCommentsByPostId = async (req, res) => {
    const postId = req.query.post_id;

    try {
        const comments = await CommentModel.find({ postId: postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new comment
const createComment = async (req, res) => {
    try {
        const commentBody = req.body;

        // Create the comment
        const comment = await CommentModel.create(commentBody);

        // Update the associated post by adding the comment ID
        await Post.findByIdAndUpdate(
            commentBody.postId, // Ensure `postId` is passed in the request body
            { $push: { comments: comment._id } }, // Add the comment ID to the comments array
            { new: true, useFindAndModify: false } // Return updated post (optional)
        );

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update a comment by its ID
const updateComment = async (req, res) => {
    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            req.params.comment_id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    const commentId = req.params.comment_id;

    try {
        // Find the comment to get its associated postId
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const { postId } = comment;

        // Delete the comment
        await CommentModel.findByIdAndDelete(commentId);

        // Remove the comment ID from the post's comments array
        await PostModel.findByIdAndUpdate(
            postId,
            { $pull: { comments: commentId } }, // Remove the comment ID from the array
            { new: true, useFindAndModify: false }
        );

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllComments,
    getCommentById,
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
};
