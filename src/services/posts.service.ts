import knex from '../util/db';
import {
  Post,
  PostCreate,
  PostUpdate,
  PostID,
  PostPatch,
} from '../models/posts.model';
import moment from 'moment';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import { QueryBuilder } from 'knex';

export interface GetPosts {
  (
    limit: number | undefined,
    offset: number | undefined,
    id: string | undefined,
    article_url?: string | undefined,
    prop_id?: string | undefined,
    league?: string | undefined
  ): Promise<Post | Post[] | void>;
}

export interface PublisherMeta {
  id: string | number;
  source_url: string;
  logo: string;
}

// get posts
export const getPosts: GetPosts = async (
  limit = 25,
  offset = 0,
  id,
  article_url,
  prop_id,
  league
) => {
  const posts: Post | Post[] = knex
    .select('*')
    .from('posts')
    .where((builder: QueryBuilder) => {
      const query = { limit, offset, id, article_url, prop_id };
      const computedQuery: Record<string, string | number | undefined> = omitBy(
        query,
        (item) => {
          if (item === undefined || item === null) {
            return true;
          }
          return false;
        }
      );
      if (!league) {
        builder
          .where(omit(computedQuery, ['limit', 'offset']))
          .andWhere({ deleted_at: null });
      } else {
        builder
          .where(omit(computedQuery, ['limit', 'offset']))
          .andWhere(knex.raw(`league->>'leagues' like ?`, [league]))
          .andWhere({ deleted_at: null });
      }
    })
    .limit(limit)
    .offset(offset)
    .orderBy('id', 'desc');
  if (!posts) {
    throw new Error('Could not retrieve posts from API!');
  }
  return posts;
};

// create post
export const createPost = async (body: PostCreate): Promise<string | void> => {
  const {
    author_id,
    publisher_id,
    publisher_logo,
    publisher_source_url,
    article_url,
    excerpt,
    featured_img,
    headline,
    league,
    post_title,
    prop_id,
    publisher_name,
  } = body;
  try {
    const getPublisherMeta = async (): Promise<PublisherMeta | null> => {
      if (!publisher_id) {
        return null;
      }
      const meta = await knex('publishers')
        .select('id', 'source_url', 'logo')
        .where({ id: publisher_id })
        .catch((err: string) => {
          throw new Error(err);
        });
      return meta && meta[0];
    };

    const post = await getPublisherMeta()
      .then(async (meta) => {
        if (!meta) {
          console.info(
            `No publisher meta found, skipping publisher population for ${article_url}, prop id: ${prop_id}, publisher: ${publisher_name}`
          );
        }
        const post = await knex('posts')
          .insert({
            post_title,
            league: JSON.stringify({ leagues: league }),
            article_url,
            headline,
            excerpt,
            featured_img,
            prop_id,
            publisher_name,
            author_id,
            publisher_id,
            publisher_logo: meta?.logo || publisher_logo || '',
            publisher_source_url:
              meta?.source_url || publisher_source_url || '',
          })
          .catch((err: string) => {
            throw new Error(err);
          });
        if (post.name === 'Error') {
          throw new Error(post.message);
        }
        return post;
      })
      .then((post) => post)
      .catch((err) => {
        throw new Error(err);
      });
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
    publisher_name,
    author_id,
    publisher_id,
    publisher_logo,
    publisher_source_url,
  } = body;
  try {
    const post = await knex('posts')
      .where({ id })
      .update({
        post_title,
        league: JSON.stringify({ leagues: league }),
        article_url,
        headline,
        excerpt,
        featured_img,
        prop_id,
        publisher_name,
        updated_at: moment().format(),
        author_id,
        publisher_id,
        publisher_logo,
        publisher_source_url,
      })
      .catch((err: string) => new Error(err));
    if (!post) {
      throw new Error('Could not update post record!');
    }
    if (post.name === 'Error') {
      throw new Error(post.message);
    }
    return post;
  } catch (err) {
    console.error(err);
  }
};

export const patchPost = async (body: PostPatch): Promise<string | void> => {
  try {
    const { id } = body;
    const payload = omit(body, ['id']);
    const post = await knex('posts')
      .where({ id })
      .update({ ...payload, updated_at: moment().format() });
    if (!post) {
      throw new Error('Could not update post with method patchPost');
    }
    if (post.name === 'Error') {
      throw new Error(post.message);
    }
    return post;
  } catch (err) {
    console.error(err);
  }
};

export const deletePost = async (id: PostID): Promise<string | void> => {
  try {
    const post = await knex('posts')
      .where({ id })
      .update({ deleted_at: moment().format() });
    if (!post) {
      throw new Error('Could not delete post record!');
    }
    if (post.name === 'Error') {
      throw new Error(post.message);
    }
    return post;
  } catch (err) {
    console.error(err);
  }
};
