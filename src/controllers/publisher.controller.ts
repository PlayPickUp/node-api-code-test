import { captureException } from '@sentry/minimal';
import { Request, Response } from 'express';
import { deliverDemo } from '../ctx/publisher';
import {
  findPublisherByAccessToken,
  delPost,
} from '../services/publishers.service';

export const sendDemoRequest = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { publisherEmail } = req.body;
    const response = await deliverDemo(publisherEmail);
    if (!response) {
      throw new Error('Could not send publisher demo email!');
    }
    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<Response<Record<string, string>>> => {
  try {
    const publisher_id = (req.query.publisher_id as any) as number;
    const post_id = (req.query.post_id as any) as number;
    const token = req.query.token as string;

    if (!publisher_id || !post_id || !token) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const fetchedPublisher = await findPublisherByAccessToken(token);

    if (!fetchedPublisher) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    if (fetchedPublisher.id !== publisher_id) {
      return res.sendStatus(403);
    }

    const response = await delPost(publisher_id, post_id);

    if (!response) {
      throw new Error('Could not get a post response for deletion');
    }

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    captureException(err);
    return res.sendStatus(500);
  }
};
