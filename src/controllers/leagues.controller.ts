import { Request, Response } from 'express';
import { getLeagues, getLeaguePostCount } from '../services/leagues.service';
import { Leagues } from '../models/leagues.model';

export const leagues = (req: Request, res: Response): Response<Leagues> => {
  const returnedLeagues = getLeagues();
  return res.json(returnedLeagues);
};

export const leaguePostCount = async (
  req: Request,
  res: Response
): Promise<Response<Array<{ count: string }>>> => {
  const league = req.query.league as string;
  const count = await getLeaguePostCount(league);
  return res.json(count);
};
