import { Request, Response } from 'express';
import { postsByDay } from '../services/stats.service';

export const postsGetByDay = async (
  req: Request,
  res: Response
): Promise<Response<{ id: number | string; published_at: Date }[]>> => {
  try {
    const posts = await postsByDay();
    if (!posts) throw new Error('Could not get posts!');
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
