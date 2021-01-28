import { Request, Response } from 'express';
import { deliverDemo } from '../ctx/publisher';

export const sendDemoRequest = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const publisherEmail = req.query.publisherEmail as string;
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
