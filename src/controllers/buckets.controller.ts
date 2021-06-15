import { Request, Response } from 'express';
import {
  addBucketPost,
  createBucket,
  deleteBucket,
  delBucketPost,
  getBuckets,
  updateBucket,
  updateBucketPost,
} from '../services/buckets.service';
import head from 'lodash/head';
import { PUServerEvents } from '@playpickup/server-events';

type KnexError = { name: string; message: string };

const { MIXPANEL_TOKEN, NODE_ENV } = process.env;
const tracking = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const buckets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { query } = req;

  const id = query.id as string;
  const position = query.position as string;

  try {
    const buckets = await getBuckets(id, position);
    if (!buckets) throw new Error('Could not get buckets!');

    return res.json(buckets);
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
    const bucket: { id: string | number }[] | KnexError = await createBucket(
      body
    );
    if (!bucket) {
      tracking.captureEvent('bucket_creation_error', null, { ...body });
      throw new Error('Could not create bucket!');
    }

    const data: { id: string | number } | undefined = head(
      bucket as Array<{ id: string | number }>
    ) as { id: string | number };

    if (!data) {
      throw new Error('No bucket ID returned on creation');
    }
    tracking.captureEvent('bucket_created', null, { ...data });
    return res.json({ message: 'Created', id: data.id });
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
  const { id } = req.query;
  try {
    if (!id) {
      throw new Error('No bucket ID supplied!');
    }
    const bucket = await updateBucket(id as string, body);
    if (!bucket) {
      throw new Error('Could not update bucket!');
    }

    const data: { id: string | number } | undefined = head(
      bucket as Array<{ id: string | number }>
    ) as { id: string | number };

    tracking.captureEvent('bucket_updated', null, { ...body });
    return res.json({ message: 'Updated', id: data.id });
  } catch (err) {
    tracking.captureEvent('bucket_update_error', null, { ...body, err });
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const del = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.query;
  try {
    if (!id) {
      throw new Error('No bucket ID supplied!');
    }
    const bucket = await deleteBucket(id as string);
    if (!bucket) {
      throw new Error('Could not delete bucket!');
    }
    tracking.captureEvent('bucket_deleted', null, { bucket_id: id, ...bucket });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    tracking.captureEvent('bucket_delete_error', null, { bucket_id: id, err });
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const createBucketPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  try {
    const bucketPost = await addBucketPost(body);
    if (!bucketPost) {
      throw new Error('Could not add new bucket-post record');
    }
    tracking.captureEvent('bucket_post_created', null, { ...body, bucketPost });
    return res.json({ message: 'Created' });
  } catch (err) {
    tracking.captureEvent('bucket_post_creation_error', null, { ...body, err });
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const patchBucketPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  const post_id = req.query.post_id as string;
  const bucket_id = req.query.bucket_id as string;

  try {
    const bucketPost = await updateBucketPost(post_id, bucket_id, body);
    if (!bucketPost) throw new Error('Could not update bucket-post record');
    tracking.captureEvent('bucket_post_updated', null, {
      ...body,
      post_id,
      bucket_id,
    });
    return res.json({ message: 'Updated' });
  } catch (err) {
    tracking.captureEvent('bucket_post_update_error', null, {
      ...body,
      bucket_id,
      post_id,
    });
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const deleteBucketPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.query;
  try {
    if (!id) throw new Error('No ID supplied for deletion');
    const bucketPost = await delBucketPost(id as string);
    if (!bucketPost) throw new Error('Could not delete bucket-post record');
    tracking.captureEvent('bucket_post_deleted', null, { id });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    tracking.captureEvent('bucket_post_deleted_error', null, { id, err });
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
