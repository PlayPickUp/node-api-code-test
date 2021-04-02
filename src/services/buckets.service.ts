import knex from '../util/db';
import { Bucket, BucketCreate } from '../models/buckets.model';
import { QueryBuilder } from 'knex';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import moment from 'moment';

type KnexError = { name: string; message: string };

export type GetBuckets = (id: string) => Promise<Bucket[] | KnexError>;

export type CreateBucket = (
  body: BucketCreate
) => Promise<Array<{ id: string | number }> | KnexError>;

export type UpdateBucket = (
  id: string | number,
  body: BucketCreate
) => Promise<Array<{ id: string | number }> | KnexError>;

export type DeleteBucket = (
  id: string | number
) => Promise<Array<{ id: string | number }> | KnexError>;

// Get Buckets
export const getBuckets: GetBuckets = async (id, limit = 25, offset = 0) => {
  const query = { id, limit, offset };
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
    .catch((err: string) => {
      throw err;
    });
  if (!buckets) {
    throw new Error('Could not get buckets');
  } else if (buckets.name === 'Error') {
    throw new Error(buckets.message);
  }
  return buckets;
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
