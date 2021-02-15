import knex from '../util/db';
import { Post, PostCreate, PostUpdate } from '../models/posts.model';
import moment from 'moment';

// get posts
export const getPosts = async (
  limit: string | undefined = '25',
  offset: string | undefined = '0',
  id: string
): Promise<Post | Post[] | void> => {
  if (id) {
    // get single post
    const post: Post = await knex.select('*').from('posts').where({ id });
    if (!post) {
      throw new Error('Could not get prop!');
    }
    return post;
  } else {
    // get multiple posts
    try {
      const posts: Post[] = await knex
        .select('*')
        .from('posts')
        .orderBy('id', 'desc')
        .limit(limit)
        .offset(offset);
      if (!posts) {
        throw new Error('Could not get Posts');
      }
      return posts;
    } catch (err) {
      console.error(err);
    }
  }
};

// create post
export const createPost = async (body: PostCreate): Promise<string | void> => {
  const {
    post_title,
    league,
    article_url,
    headline,
    excerpt,
    featured_img,
    prop_id,
  } = body;
  try {
    const post = await knex('posts')
      .insert({
        post_title,
        league: JSON.stringify(league),
        article_url,
        headline,
        excerpt,
        featured_img,
        prop_id,
      })
      .catch((err: string) => new Error(err));
    return post;
  } catch (err) {
    console.error(err);
  }
};

export const updatePost = async (body: PostUpdate): Promise<string | void> => {
  const {
    id,
    post_title,
    league,
    article_url,
    headline,
    excerpt,
    featured_img,
    prop_id,
  } = body;
  try {
    const post = await knex('posts')
      .where({ id })
      .update({
        post_title,
        league: JSON.stringify(league),
        article_url,
        headline,
        excerpt,
        featured_img,
        prop_id,
        updated_at: moment().format(),
      })
      .catch((err: string) => new Error(err));
    if (!post) {
      throw new Error('Could not update post record!');
    }
    return post;
  } catch (err) {
    console.error(err);
  }
};

export const deletePost = async (
  id: number | string
): Promise<string | void> => {
  try {
    const post = await knex('posts')
      .where({ id })
      .update({ deleted_at: moment().format() });
    if (!post) {
      throw new Error('Could not delete post record!');
    }
    return post;
  } catch (err) {
    console.error(err);
  }
};
