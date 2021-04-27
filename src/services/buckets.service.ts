import knex from '../util/db';
import { Bucket, BucketCreate, BucketPost } from '../models/buckets.model';
import { QueryBuilder } from 'knex';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import assignIn from 'lodash/assignIn';
import moment from 'moment';
import { Post } from '../models/posts.model';
import { posts } from '../controllers/posts.controller';

type KnexError = { name: string; message: string };

export type GetBuckets = (id: string) => Promise<Bucket[] | KnexError>;

export type GetBucketPosts = (
  bucket_id: string | number
) => Promise<Post[] | KnexError>;

export type CreateBucket = (
  body: BucketCreate
) => Promise<Array<{ id: string | number }> | KnexError>;

export type UpdateBucketPost = (
  id: number | string,
  bucket_id: string | number,
  body: BucketCreate
) => Promise<Array<{ id: string | number }> | KnexError>;

export type UpdateBucket = (
  id: string | number,
  body: BucketCreate
) => Promise<Array<{ id: string | number }> | KnexError>;

export type DeleteBucket = (
  id: string | number
) => Promise<Array<{ id: string | number }> | KnexError>;

export type DelBucketPost = (
  id: string | number
) => Promise<Array<{ id: string | number }> | KnexError>;

export type DelBucketPostRelation = (
  post_id: string | number
) => Promise<void | KnexError>;

export type AddBucketPost = (body: BucketPost) => Promise<string | KnexError>;

// Get Buckets
export const getBuckets = async (
  id?: string | number,
  position?: string,
  limit = 75,
  offset = 0
): Promise<Bucket[] | void> => {
  const query = { id, limit, offset, position };
  const buckets = await knex
    .select('*')
    .from('buckets')
    .where((builder: QueryBuilder) => {
      const computedQuery: Record<string, string | number | undefined> = omitBy(
        query,
        (item) => {
          if (item === undefined || item === null) {
            return true;
          }
          return false;
        }
      );
      builder
        .where(omit(computedQuery, ['limit', 'offset']))
        .andWhere({ deleted_at: null });
    })
    .orderBy('id', 'desc')
    .catch((err: string) => {
      throw err;
    });
  if (!buckets) {
    throw new Error('Could not get buckets');
  } else if (buckets.name === 'Error') {
    throw new Error(buckets.message);
  }

  const attachedPosts = async (): Promise<Bucket[]> =>
    await Promise.all(
      buckets.map(async (bucket: Bucket) => {
        const posts = await getBucketPosts(bucket.id);
        const expandedBucket = assignIn(bucket, { posts });
        return expandedBucket;
      })
    );

  return await attachedPosts().catch((err) => {
    throw err;
  });
};

// Create Bucket
export const createBucket: CreateBucket = async (body) => {
  const { title, position, created_by_id } = body;
  const bucket = await knex('buckets')
    .insert({ title, position, created_by_id })
    .returning(['id'])
    .catch((err: string) => {
      throw err;
    });

  if (!bucket) {
    throw new Error('Could not create bucket!');
  } else if (bucket.name === 'Error') {
    throw new Error(bucket.message);
  }
  return bucket;
};

// Update Bucket
export const updateBucket: UpdateBucket = async (id, body) => {
  const { title, position, created_by_id } = body;
  const bucket = await knex('buckets')
    .where({ id })
    .update({
      title,
      position,
      created_by_id,
      updated_at: moment().toISOString(),
    })
    .returning(['id'])
    .catch((err: string) => {
      throw err;
    });

  if (!bucket) {
    throw new Error('Could not update bucket!');
  } else if (bucket.name === 'Error') {
    throw new Error(bucket.message);
  }
  return bucket;
};

// Delete Bucket
export const deleteBucket: DeleteBucket = async (id) => {
  const bucket = await knex('buckets')
    .where({ id })
    .update({ deleted_at: moment().toISOString() })
    .returning(['id'])
    .catch((err: string) => {
      throw err;
    });

  if (!bucket) {
    throw new Error('Could not update bucket!');
  } else if (bucket.name === 'Error') {
    throw new Error(bucket.message);
  }
  return bucket;
};

// Add Bucket + Post Record
export const addBucketPost: AddBucketPost = async (body) => {
  const bucketsPosts = await knex('buckets_posts')
    .insert({ ...body })
    .catch((err: string) => {
      throw err;
    });

  if (!bucketsPosts)
    throw new Error('Could not create buckets_posts relationship');

  if (bucketsPosts.name === 'Error') {
    throw new Error(bucketsPosts.message);
  }
  return bucketsPosts;
};

// Get Posts Attached to Buckets
export const getBucketPosts: GetBucketPosts = async (bucket_id) => {
  const posts = await knex('buckets_posts')
    .select()
    .where({
      bucket_id,
      deleted_at: null,
    })
    .orderBy('order', 'asc');

  if (!posts)
    throw new Error(
      `Could not get posts associated with bucket_id: ${bucket_id}`
    );

  if (posts.name === 'Error') {
    throw new Error(posts.message);
  }

  return posts;
};

// update a bucket-post record
export const updateBucketPost: UpdateBucketPost = async (
  post_id,
  bucket_id,
  body
) => {
  const bucketPost = await knex('buckets_posts')
    .where({ post_id, bucket_id })
    .update({ ...body })
    .returning(['id']);

  if (!bucketPost) {
    throw new Error('Could not update bucket_post record!');
  }

  if (getBucketPosts.name === 'Error') {
    throw new Error(bucketPost.message);
  }

  return bucketPost;
};

// Delete Post Attached to Bucket
export const delBucketPost: DelBucketPost = async (id) => {
  const post = await knex('buckets_posts')
    .select()
    .where({ id })
    .update({
      deleted_at: moment().toISOString(),
    })
    .returning(['id']);

  if (!post) {
    throw new Error(`Could not remove post`);
  }

  if (posts.name === 'Error') {
    throw new Error(post.message);
  }

  return post;
};

// delete attached BucketPost on Post Deletion
export const delBucketPostRelation: DelBucketPostRelation = async (post_id) => {
  await knex('buckets_posts')
    .where({ post_id })
    .update({ deleted_at: moment().toISOString() })
    .catch((err: Error) => {
      throw err;
    });
};
