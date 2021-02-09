import express, { Request, Response } from 'express';
import { posts, create } from '../controllers/posts.controller';

const postsRouter = express.Router();

postsRouter.get('/', (req: Request, res: Response) => res.sendStatus(403));

postsRouter.get(
  '/posts',
  async (req: Request, res: Response) => await posts(req, res)
);
postsRouter.post(
  '/posts',
  async (req: Request, res: Response) => await create(req, res)
);

export default postsRouter;
