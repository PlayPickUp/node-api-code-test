import { captureException } from '@sentry/minimal';
import { Request, Response } from 'express';
import { PUServerEvents } from '@playpickup/server-events';

import { deliverDemo } from '../ctx/publisher';
import {
  findPublisherByAccessToken,
  delPost,
} from '../services/publishers.service';

const { NODE_ENV, MIXPANEL_TOKEN } = process.env;

const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

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
    tracker.captureEvent('publisher_demo_requested', null, { publisherEmail });
    return res.json(response);
  } catch (err) {
    tracker.captureEvent('publisher_demo_requested_error', null, {
      ...req.body,
      err,
    });
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
      tracker.captureEvent('publisher_post_deleted_bad_request', null, {
        ...req.query,
        token: 'redacted or missing',
      });
      return res.status(400).json({ message: 'Bad Request' });
    }

    const fetchedPublisher = await findPublisherByAccessToken(token);

    if (!fetchedPublisher) {
      tracker.captureEvent('publisher_post_deleted_publisher_not_found', null, {
        publisher_id,
        post_id,
      });
      return res.status(400).json({ message: 'Bad Request' });
    }

    if (fetchedPublisher.id !== publisher_id) {
      tracker.captureEvent('publisher_post_deleted_forbidden', null, {
        publisher_id,
        post_id,
        publisher_name: fetchedPublisher.name,
      });
      return res.sendStatus(403);
    }

    const response = await delPost(publisher_id, post_id);

    if (!response) {
      throw new Error('Could not get a post response for deletion');
    }

    tracker.captureEvent('publisher_post_deleted', null, {
      publisher_id,
      post_id,
      publisher_name: fetchedPublisher.name,
    });
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    tracker.captureEvent('publisher_post_deleted_error', null, {
      ...req.query,
      token: 'redacted',
      err,
    });
    console.error(err);
    captureException(err);
    return res.sendStatus(500);
  }
};
