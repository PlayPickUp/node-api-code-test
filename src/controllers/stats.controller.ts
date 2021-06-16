import { Request, Response } from 'express';
import { PUServerEvents } from '@playpickup/server-events';

import { postsByDay } from '../services/stats.service';

const { NODE_ENV, MIXPANEL_TOKEN } = process.env;

const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const postsGetByDay = async (
  req: Request,
  res: Response
): Promise<Response<{ id: number | string; published_at: Date }[]>> => {
  try {
    const posts = await postsByDay();
    if (!posts) throw new Error('Could not get posts!');
    tracker.captureEvent('posts_by_day_queried', null, null);
    return res.json(posts);
  } catch (err) {
    tracker.captureEvent('posts_by_day_queried_error', null, { err });
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
