import knex from '../util/db';
import { Post, PostCreate } from '../models/posts.model';

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
