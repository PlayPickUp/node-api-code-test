import {Request, Response} from 'express';
import {getLeagues} from '../services/leagues.service';
import {Leagues} from '../models/leagues.model';

export const leagues = (req: Request, res: Response): Response<Leagues> => {
  const returnedLeagues = getLeagues();
  return res.json(returnedLeagues);
};
