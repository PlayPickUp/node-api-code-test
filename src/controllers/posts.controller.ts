import { Request, Response } from 'express';
import split from 'lodash/split';
import axios from 'axios';
import { PUServerEvents } from '@playpickup/server-events';

import { delBucketPostRelation } from '../services/buckets.service';
import {
  createPost,
  deletePost,
  getPosts,
  patchPost,
  updatePost,
} from '../services/posts.service';
import { makeSlug } from '@playpickup/sluggy';
import { handleLeagueValue } from '../helpers/posts/post.helper';
import { Post } from '../models/posts.model';

const { PRERENDER_TOKEN, NODE_ENV, MIXPANEL_TOKEN } = process.env;

const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const posts = async (req: Request, res: Response): Promise<Response> => {
  const { query } = req;

  const limit: number = (query.limit as unknown) as number;
  const offset: number = (query.offset as unknown) as number;
  const id = query.id as string;
  const article_url = query.article_url as string;
  const prop_id = query.prop_id as string;
  const league = query.league as string;
  const search = query.search as string;
  const publisher_id = query.publisher_id as string;

  try {
    const posts = await getPosts(
      limit,
      offset,
      id,
      article_url,
      prop_id,
      league,
      search,
      publisher_id
    );

    if (!posts) throw new Error('Could not get posts from database!');
    const transformedPosts = posts.map((post: Post) => {
      const postSlug = makeSlug(post.post_title);
      const postLeague = handleLeagueValue(post.league.leagues);
      const postWithSlug = {
        ...post,
        slug: `${postLeague}/${postSlug}-${post.id}`,
      };
      return postWithSlug;
    });

    tracker.captureEvent('posts_queried', null, { ...query, posts });
    return res.json(transformedPosts);
  } catch (err) {
    tracker.captureEvent('posts_queried_error', null, { ...query, err });
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
        const postSlug = makeSlug(post.post_title);
        const postLeague = handleLeagueValue(post.league.leagues);
        const postUrl = `/news/${postLeague}/${postSlug}-${post.id}`;

        await axios
          .post('https://api.prerender.io/recache', {
            prerenderToken: PRERENDER_TOKEN,
            url: `https://playpickup.com${postUrl}`,
          })
          .then((response) => {
            if (response.status !== 200)
              throw new Error('Prerender threw a non 200 status code');
            tracker.captureEvent('post_prerender_request', null, {
              ...response,
              ...post,
            });
          })
          .catch((err) => console.error(err));
      } catch (err) {
        tracker.captureEvent('post_prerender_error', null, { err, ...post });
        console.error(err);
      }
    }
    tracker.captureEvent('post_created', null, { ...body });
    return res.json({ message: 'Created' });
  } catch (err) {
    tracker.captureEvent('post_creation_error', null, { ...body, err });
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
    tracker.captureEvent('post_updated', null, { ...body });
    return res.json({ message: 'Updated' });
  } catch (err) {
    tracker.captureEvent('post_updated_error', null, { ...body, err });
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
    tracker.captureEvent('post_patched', null, { ...body });
    return res.json({ message: 'Updated' });
  } catch (err) {
    tracker.captureEvent('post_patched_error', null, { ...body, err });
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
    // remove any deleted posts from buckets
    await Promise.all(
      idPayload.map(async (id) => {
        await delBucketPostRelation(id);
      })
    );
  } catch (err) {
    console.error('Could not remove bucket_post relation: ', err);
  }

  try {
    const failedDeletes: string[] = [];
    for (const postId of idPayload) {
      const response = await deletePost(postId as string);
      if (!response) failedDeletes.push(postId);
    }
    if (failedDeletes.length > 0) {
      tracker.captureEvent('post_failed_deletions', null, {
        posts: failedDeletes,
      });
      return res.json({
        message:
          'Delete completed with errors: the following Posts were not deleted: ' +
          failedDeletes,
      });
    }

    tracker.captureEvent('post_deleted', null, { id: idPayload });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    tracker.captureEvent('post_deleted_error', null, { id: idPayload, err });
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
