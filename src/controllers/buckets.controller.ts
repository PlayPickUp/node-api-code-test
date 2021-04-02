import { Request, Response } from 'express';
import {
  getBuckets,
  createBucket,
  updateBucket,
  deleteBucket,
} from '../services/buckets.service';

export const buckets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { query } = req;

  const id = query.id as string;

  try {
    const buckets = await getBuckets(id);
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
    const bucket = await createBucket(body);
    if (!bucket) throw new Error('Could not create bucket!');

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
  const { id } = req.query;
  try {
    if (!id) {
      throw new Error('No bucket ID supplied!');
    }
    const bucket = await updateBucket(id as string, body);
    if (!bucket) throw new Error('Could not update bucket!');

    return res.json({ message: 'Updated' });
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
