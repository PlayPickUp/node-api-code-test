import { Request, Response } from 'express';
import { PUServerEvents } from '@playpickup/server-events';

import { getClosingProps, getProps } from '../services/props.service';
import { getPickStateByProp } from '../services/picks.service';

const { NODE_ENV, MIXPANEL_TOKEN } = process.env;

const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const props = async (req: Request, res: Response): Promise<Response> => {
  if (req.method === 'GET') {
    const limit = req.query.limit as string;
    const offset = req.query.offset as string;
    const id = req.query.id as string;

    const props = await getProps(limit, offset, id);
    tracker.captureEvent('props_queried', null, { ...req.query, props });
    return res.json(props);
  } else {
    tracker.captureEvent('props_queried_error', null, { ...req.query });
    return res.sendStatus(500);
  }
};

export const propState = async (
  req: Request,
  res: Response
): Promise<Response<Record<string, string> | Record<string, string>[]>> => {
  const { prop_id } = req.query; // prop id

  if (!prop_id) {
    tracker.captureEvent('prop_state_no_id_error', null, {
      ...req.query,
      err: 'Bad Request',
    });
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const pickState = await getPickStateByProp(prop_id as string);
    if (!pickState) throw new Error('Could not get picks!');
    tracker.captureEvent('prop_state_queried', null, {
      ...req.query,
      pickState,
    });
    return res.json(pickState); // prop state is depicted in pick state
  } catch (err) {
    tracker.captureEvent('prop_state_queried_error', null, {
      ...req.query,
      err,
    });
    console.error(err);
    return res.status(500).send(err);
  }
};

export const closingProps = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const props = await getClosingProps();
  tracker.captureEvent('closing_props_queried', null, { props });
  return res.json(props);
};
