import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';

import { privateCorsConfig } from '../util/corsOptions';
import { users } from '../controllers/users.controller';

const usersRouter = express.Router();

usersRouter.get(
  '/users',
  cors(privateCorsConfig),
  passport.authenticate('admintoken', { session: false }),
  async (req: Request, res: Response) => await users(req, res)
);

export default usersRouter;
