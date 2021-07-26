import { Request, Response } from 'express';

import { pickupErrorHandler } from '../helpers/errorHandler';
import { createFanPick } from '../services/fans.service';
import { CreateFanPick } from '../types';

export const fanPick = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: CreateFanPick = req.body;

  if (
    !body ||
    !body.ip_address ||
    !body.pick_id ||
    !body.prop_id ||
    !body.source_url
  ) {
    return res
      .status(400)
      .send(
        'Missing required body properties, see documentation or contact PickUp Engineering'
      );
  }

  try {
    const payload = await createFanPick(body);
    return res.json(payload);
  } catch (err) {
    pickupErrorHandler(err);
    return res.status(500).send(err);
  }
};
