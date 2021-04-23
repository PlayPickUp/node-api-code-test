import { Request, Response } from 'express';
import split from 'lodash/split';
import isArray from 'lodash/isArray';
import axios from 'axios';

import {
  createPost,
  deletePost,
  getPosts,
  patchPost,
  updatePost,
} from '../services/posts.service';
import { makeSlug } from '../helpers/posts/slug.helper';

const { PRERENDER_TOKEN, NODE_ENV } = process.env;

export const posts = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req;

  const limit: number = (query.limit as unknown) as number;
  const offset: number = (query.offset as unknown) as number;
  const id = query.id as string;
  const article_url = query.article_url as string;
  const prop_id = query.prop_id as string;
  const league = query.league as string;
  const search = query.search as string;

  try {
    const posts = await getPosts(
      limit,
      offset,
      id,
      article_url,
      prop_id,
      league,
      search
    );
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

    // send API request to prerender.io to cache the new post, only on prod
    if (NODE_ENV === 'production') {
      try {
        const handleLeagueValue = (league: string | string[]) => {
          if (isArray(league)) {
            return league[0];
          } else {
            const leagueArray = league.split(',');
            return leagueArray[0];
          }
        };
        const handlePostSlug = (title: string) => makeSlug(title);
        const postUrl =
          `/news/${handleLeagueValue(post.league.leagues)}` +
          `/${handlePostSlug(post.post_title)}-${post.id}`;

        await axios
          .post('https://api.prerender.io/recache', {
            prerenderToken: PRERENDER_TOKEN,
            url: `https://playpickup.com${postUrl}`,
          })
          .then((response) => {
            if (response.status !== 200)
              throw new Error('Prerender threw a non 200 status code');
          })
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
      }
    }

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

export const patch = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;
  try {
    const post = await patchPost(body).catch((err) => {
      throw err;
    });
    if (!post) {
      throw new Error('Could not patch post!');
    }
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
