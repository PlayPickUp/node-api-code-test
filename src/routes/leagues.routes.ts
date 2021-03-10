import express, { Request, Response } from 'express';
import { leagues, leaguePostCount } from '../controllers/leagues.controller';
import cors from 'cors';
import { privateCorsConfig } from '../util/corsOptions';

const leaguesRouter = express.Router();

leaguesRouter.get(
  '/leagues/postCount',
  cors(privateCorsConfig),
  async (req: Request, res: Response) => await leaguePostCount(req, res)
);

leaguesRouter.get(
  '/leagues',
  cors(privateCorsConfig),
  (req: Request, res: Response) => leagues(req, res)
);

export default leaguesRouter;
