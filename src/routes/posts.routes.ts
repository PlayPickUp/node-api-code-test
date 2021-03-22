import express, { Request, Response } from 'express';
import {
  create,
  del,
  patch,
  posts,
  update,
} from '../controllers/posts.controller';
import passport from 'passport';
import cors from 'cors';
import { privateCorsConfig, publicCorsConfig } from '../util/corsOptions';

const postsRouter = express.Router();

postsRouter.get(
  '/posts',
  cors(publicCorsConfig),
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await posts(req, res)
);
postsRouter.post(
  '/posts',
  cors(publicCorsConfig),
  passport.authenticate('publishertoken', {
    session: false,
  }),
  async (req: Request, res: Response) => await create(req, res)
);

postsRouter.put(
  '/posts',
  cors(publicCorsConfig),
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await update(req, res)
);

postsRouter.patch(
  '/posts',
  cors(publicCorsConfig),
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await patch(req, res)
);

postsRouter.delete(
  '/posts',
  cors(privateCorsConfig),
  passport.authenticate('admintoken', { session: false }),
  async (req: Request, res: Response) => await del(req, res)
);

export default postsRouter;
