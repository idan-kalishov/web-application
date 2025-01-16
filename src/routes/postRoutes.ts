import express, { Request, Response } from 'express';
import * as postController from '../controllers/postController';
import {authMiddleware} from "../controllers/authController"; // Adjust the import if necessary

const postRouter = express.Router();

// Define routes and associate them with the controller methods
postRouter.get('/', (req: Request, res: Response) => postController.getAllPosts(req, res));
postRouter.get('/:post_id', (req: Request, res: Response) => postController.getPostById(req, res));
postRouter.get('/sender', (req: Request, res: Response) => postController.getPostsBySender(req, res));
postRouter.post('/', (req: Request, res: Response) => postController.addPost(req, res));
postRouter.put('/:post_id', (req: Request, res: Response) => postController.updatePost(req, res));
postRouter.delete('/:post_id', (req: Request, res: Response) => postController.deletePost(req, res));

export default postRouter;
