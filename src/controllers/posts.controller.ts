import { Request, Response } from 'express';
import { createPost, getPosts } from '../services/posts.service';

export const posts = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req;

  const limit = query.limit as string;
  const offset = query.offset as string;
  const id = query.id as string;

  try {
    const posts = await getPosts(limit, offset, id);
    if (!posts) {
      throw new Error('Could not get posts from database!');
    } else {
      return res.json(posts);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  try {
    const post = await createPost(body);
    if (!post) {
      throw new Error('Could not create post!');
    }
    return res.json({ message: 'Created' });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
