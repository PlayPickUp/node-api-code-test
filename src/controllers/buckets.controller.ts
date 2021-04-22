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

type KnexError = { name: string; message: string };

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
    if (!bucket) throw new Error('Could not create bucket!');

    const data: { id: string | number } | undefined = head(
      bucket as Array<{ id: string | number }>
    ) as { id: string | number };

    if (!data) {
      throw new Error('No bucket ID returned on creation');
    }

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
    if (!bucket) throw new Error('Could not update bucket!');

    const data: { id: string | number } | undefined = head(
      bucket as Array<{ id: string | number }>
    ) as { id: string | number };

    return res.json({ message: 'Updated', id: data.id });
  } catch (err) {
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
    if (!bucket) throw new Error('Could not delete bucket!');
    return res.json({ message: 'Deleted' });
  } catch (err) {
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
    if (!bucketPost) throw new Error('Could not add new bucket-post record');
    return res.json({ message: 'Created' });
  } catch (err) {
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

  try {
    const bucketPost = await updateBucketPost(post_id, body);
    if (!bucketPost) throw new Error('Could not update bucket-post record');
    return res.json({ message: 'Updated' });
  } catch (err) {
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
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
