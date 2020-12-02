import { Request, Response } from 'express';
import { generateEmail } from '../crons/checkClosingProps';
import { getClosingProps, getProps } from '../ctx/props';

export const props = async (req: Request, res: Response): Promise<Response> => {
  if (req.method === 'GET') {
    const limit = req.query.limit as string;
    const offset = req.query.offset as string;
    const id = req.query.id as string;

    const props = await getProps(limit, offset, id);
    return res.json(props);
  } else {
    return res.sendStatus(500);
  }
};

export const closingProps = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const email = req.query.email as string;
  if (email) {
    console.log('API hit with generate email param...');
    generateEmail();
  }
  const props = await getClosingProps();
  return res.json(props);
};
