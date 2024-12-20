import express, { Request, Response } from 'express';
import * as commentsController from '../controllers/commentsController'; // Adjust the import if necessary

const commentsRouter = express.Router();

// Define routes and associate them with the controller methods
commentsRouter.get('/', (req: Request, res: Response) => commentsController.getAllComments(req, res));
commentsRouter.get('/:comment_id', (req: Request, res: Response) => commentsController.getCommentById(req, res));
commentsRouter.get('/:post_id', (req: Request, res: Response) => commentsController.getCommentsByPostId(req, res));
commentsRouter.post('/', (req: Request, res: Response) => commentsController.createComment(req, res));
commentsRouter.delete('/:comment_id', (req: Request, res: Response) => commentsController.deleteComment(req, res));
commentsRouter.put('/:comment_id', (req: Request, res: Response) => commentsController.updateComment(req, res));

export default commentsRouter;
