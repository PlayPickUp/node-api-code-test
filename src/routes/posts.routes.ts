import express, { Request, Response } from 'express';
import { posts, create, update, del } from '../controllers/posts.controller';
import passport from 'passport';

const postsRouter = express.Router();

postsRouter.get('/', (req: Request, res: Response) => res.sendStatus(403));

postsRouter.get(
  '/posts',
  async (req: Request, res: Response) => await posts(req, res)
);
postsRouter.post(
  '/posts',
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await create(req, res)
);

postsRouter.put(
  '/posts',
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await update(req, res)
);

postsRouter.delete(
  '/posts',
  passport.authenticate('admintoken', { session: false }),
  async (req: Request, res: Response) => await del(req, res)
);

export default postsRouter;
