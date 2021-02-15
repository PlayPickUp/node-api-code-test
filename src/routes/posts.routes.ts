import express, { Request, Response } from 'express';
import { posts, create, update, del } from '../controllers/posts.controller';

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
postsRouter.put(
  '/posts',
  async (req: Request, res: Response) => await update(req, res)
);

postsRouter.delete(
  '/posts',
  async (req: Request, res: Response) => await del(req, res)
);

export default postsRouter;
