import express, { Request, Response } from 'express';
import passport from 'passport';
import cors from 'cors';
import { postsGetByDay } from '../controllers/stats.controller';
import { privateCorsConfig } from '../util/corsOptions';

const statsRouter = express.Router();

statsRouter.get(
  '/stats/posts-by-day',
  cors(privateCorsConfig),
  passport.authenticate('admintoken', { session: false }),
  async (req: Request, res: Response) => await postsGetByDay(req, res)
);

export default statsRouter;
