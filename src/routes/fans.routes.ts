import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';

import { fanPick } from '../controllers/fans.controller';
import { publicCorsConfig } from '../util/corsOptions';

const fansRouter = express.Router();

fansRouter.post(
  '/fans/pick',
  cors(publicCorsConfig),
  passport.authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await fanPick(req, res)
);

export default fansRouter;
