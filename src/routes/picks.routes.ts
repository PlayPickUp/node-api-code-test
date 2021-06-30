import express, { Request, Response } from 'express';
import cors from 'cors';
import { publicCorsConfig } from '../util/corsOptions';
import passport from 'passport';

import { picks } from '../controllers/picks.controller';

export const picksRouter = express.Router();

picksRouter.get(
  '/picks',
  cors(publicCorsConfig),
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await picks(req, res)
);
