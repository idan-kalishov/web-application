const CommentModel = require('../models/commentsModel'); // Adjust the path to your model

// Get all comments
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
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

        await comment = CommentModel.create(commentBody);

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

module.exports = {
    getAllComments,
    getCommentById,
    getCommentsByPostId,
    createComment,
    updateComment
};
