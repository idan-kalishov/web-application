import express, { Request, Response, Router } from 'express';
import * as postController from '../controllers/postController';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    await postController.addPost(req, res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/data', async (req: Request, res: Response) => {
  try {
    await postController.getAllPosts(req, res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:post_id', async (req: Request, res: Response) => {
  try {
    await postController.getPostById(req, res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    await postController.getPostsBySender(req, res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/:post_id', async (req: Request, res: Response) => {
  try {
    await postController.updatePost(req, res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/:post_id', async (req: Request, res: Response) => {
  try {
    await postController.deletePost(req, res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
