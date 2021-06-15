import { Request, Response } from 'express';
import { PUServerEvents } from '@playpickup/server-events';

import { getLeagues, getLeaguePostCount } from '../services/leagues.service';
import { Leagues } from '../models/leagues.model';

const { MIXPANEL_TOKEN, NODE_ENV } = process.env;
const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const leagues = (req: Request, res: Response): Response<Leagues> => {
  const returnedLeagues = getLeagues();
  tracker.captureEvent('leagues_list_called', null, { ...returnedLeagues });
  return res.json(returnedLeagues);
};

export const leaguePostCount = async (
  req: Request,
  res: Response
): Promise<Response<Array<{ count: string }>>> => {
  const league = req.query.league as string;
  const count = await getLeaguePostCount(league);
  tracker.captureEvent('leagues_count_called', null, { league, count });
  return res.json(count);
};
