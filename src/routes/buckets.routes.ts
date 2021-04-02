import express, { Request, Response } from 'express';
import passport from 'passport';
import cors from 'cors';

import { privateCorsConfig } from '../util/corsOptions';
import {
  buckets,
  create,
  update,
  del,
} from '../controllers/buckets.controller';

const bucketsRouter = express.Router();

bucketsRouter.get(
  '/buckets',
  cors(privateCorsConfig),
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await buckets(req, res)
);

bucketsRouter.post(
  '/buckets',
  cors(privateCorsConfig),
  passport.authenticate('admintoken', { session: false }),
  async (req: Request, res: Response) => await create(req, res)
);

bucketsRouter.put(
  '/buckets',
  cors(privateCorsConfig),
  passport.authenticate('admintoken', { session: false }),
  async (req: Request, res: Response) => await update(req, res)
);

bucketsRouter.delete(
  '/buckets',
  cors(privateCorsConfig),
  passport.authenticate('admintoken', { session: false }),
  async (req: Request, res: Response) => await del(req, res)
);

export default bucketsRouter;
