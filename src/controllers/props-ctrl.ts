import { Request, Response } from 'express';
import { getProps } from '../ctx/props';

const props = async (req: Request, res: Response): Promise<Response> => {
  if (req.method === 'GET') {
    const limit = req.query.limit as string;
    const offset = req.query.offset as string;
    const props = await getProps(limit, offset);
    return res.json(props);
  } else {
    return res.sendStatus(500);
  }
};

export default props;
