const express = require('express');
const commentsController = require('../controllers/commentsController');

const commentsRouter = express.Router();

commentsRouter.get('/', commentsController.getAllComments);

commentsRouter.get('/:comment_id', commentsController.getCommentById);


commentsRouter.get('/:post_id', commentsController.getCommentsByPostId);

commentsRouter.post('/', commentsController.createComment);

commentsRouter.put('/:comment_id', commentsController.updateComment);

module.exports = commentsRouter;
