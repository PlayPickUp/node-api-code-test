import express, { Request, Response } from 'express';
import { leagues } from '../controllers/leagues.controller';
import cors from 'cors';
import { privateCorsConfig } from '../util/corsOptions';

const leaguesRouter = express.Router();

leaguesRouter.get(
  '/leagues',
  cors(privateCorsConfig),
  (req: Request, res: Response) => leagues(req, res)
);

export default leaguesRouter;
