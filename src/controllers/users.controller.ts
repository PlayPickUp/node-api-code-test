import { Request, Response } from 'express';
import { PUServerEvents } from '@playpickup/server-events';
import { getUsers } from '../services/users.service';

const { NODE_ENV, MIXPANEL_TOKEN } = process.env;
const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const users = async (req: Request, res: Response): Promise<Response> => {
  const id = req.query.id as string;
  const users = await getUsers(id);
  if (!users) {
    tracker.captureEvent('users_queried_error', null, { ...req.query });
    return res.sendStatus(500);
  }
  tracker.captureEvent('users_queried', null, { ...req.query, users });
  return res.json(users);
};
