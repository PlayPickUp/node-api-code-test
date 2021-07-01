import { Request, Response } from 'express';
import { PUServerEvents } from '@playpickup/server-events';
import { pickupErrorHandler } from '../helpers/errorHandler';
import { getPicks } from '../services/picks.service';
import { Pick } from '../models/picks.model';

const { NODE_ENV, MIXPANEL_TOKEN } = process.env;

const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const picks = async (
  req: Request,
  res: Response
): Promise<Response<Pick[] | string>> => {
  const { query } = req;

  const limit: number = (query.limit as unknown) as number;
  const offset: number = (query.offset as unknown) as number;
  const prop_id = (query.prop_id as unknown) as number;

  try {
    const picks = await getPicks(offset, limit, prop_id);

    if (!picks) throw new Error('Could not get Picks');

    tracker.captureEvent('picks_queried', null, { ...query, picks });
    return res.json(picks);
  } catch (err) {
    tracker.captureEvent('picks_queried_error', null, { ...query, picks });
    pickupErrorHandler(err);
    return res.sendStatus(500).send(err);
  }
};
