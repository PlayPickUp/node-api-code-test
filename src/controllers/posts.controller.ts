import { Request, Response } from 'express';
import split from 'lodash/split';

import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from '../services/posts.service';

export const posts = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req;

  const limit: number = query.limit as any;
  const offset: number = query.offset as any;
  const id = query.id as string;
  const article_url = query.article_url as string;
  const prop_id = query.prop_id as string;

  try {
    const posts = await getPosts(limit, offset, id, article_url, prop_id);
    if (!posts) throw new Error('Could not get posts from database!');
    return res.json(posts);
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
    if (!post) throw new Error('Could not create post!');

    return res.json({ message: 'Created' });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  try {
    const post = await updatePost(body).catch((err) => new Error(err));
    if (!post) throw new Error('Could not update post!');
    return res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const del = async (req: Request, res: Response): Promise<Response> => {
  const {
    query: { id },
  } = req;
  if (!id) {
    return res.sendStatus(400);
  }
  const idPayload = split(id as string, ',');

  try {
    const failedDeletes: string[] = [];
    for (const postId of idPayload) {
      const response = await deletePost(postId as string);
      if (!response) failedDeletes.push(postId);
    }
    if (failedDeletes.length > 0) {
      return res.json({
        message:
          'Delete completed with errors: the following Posts were not deleted: ' +
          failedDeletes,
      });
    }
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
