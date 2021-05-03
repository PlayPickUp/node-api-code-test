import { Request, Response } from 'express';
import { getClosingProps, getProps } from '../services/props.service';
import { getPickStateByProp } from '../services/picks.service';

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

export const propState = async (
  req: Request,
  res: Response
): Promise<Response<Record<string, string> | Record<string, string>[]>> => {
  const { prop_id } = req.query; // prop id

  if (!prop_id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const pickState = await getPickStateByProp(prop_id as string);
    if (!pickState) throw new Error('Could not get picks!');
    return res.json(pickState); // prop state is depicted in pick state
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

export const closingProps = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const props = await getClosingProps();
  return res.json(props);
};
