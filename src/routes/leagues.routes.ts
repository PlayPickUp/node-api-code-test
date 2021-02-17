import express, { Request, Response } from 'express';
import { leagues } from '../controllers/leagues.controller';

const leaguesRouter = express.Router();

leaguesRouter.get('/leagues', (req: Request, res: Response) =>
  leagues(req, res)
);

export default leaguesRouter;
