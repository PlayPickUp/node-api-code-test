import { Request, Response } from 'express';

import {
  createNewPrize,
  createNewPrizeCodes,
  getRedemptionDatesForFan,
  listAllPrizes,
  redeemPrizeCodeForFan,
} from '../services/prizes.service';
import { CreatePrizeCodesResponse } from '../models/prizes.model';
import { fanIdMatchesToken, updateProfile } from '../services/fans.service';
import { Fan } from '../models/fans.model';

export const getPrizes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const prizes = await listAllPrizes();
    return res.json(prizes);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const getRedemptionDates = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { query } = req;
  try {
    if (!query.fan_id) {
      return res
        .send(400)
        .json({ error: 'Redemption Date requests must include fan_id' });
    }
    const fanId = Number(query.fan_id);
    const dates = await getRedemptionDatesForFan(fanId);
    if (!dates || dates.length < 1)
      throw new Error('Could not get redemption dates for fan');
    return res.json(dates);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
export const createPrize = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  try {
    const prize = await createNewPrize(body);
    if (!prize) throw new Error('Could not create prize!');
    return res.json({ message: 'Created' });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const addPrizeCodes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  try {
    const response: CreatePrizeCodesResponse = await createNewPrizeCodes(body);
    if (!response) throw new Error('Could not create prize codes!');
    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};

export const redeemPrizeCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  try {
    const strippedFanPartial: Partial<Fan> = {
      id: body.fan.id,
      persistence_token: body.fan.persistence_token,
      first_name: body.fan.firstname,
      last_name: body.fan.lastname,
      email: body.fan.email,
    };
    const validToken = await fanIdMatchesToken(strippedFanPartial);
    if (!body.prize_id) {
      return res
        .status(400)
        .json({ message: 'Request must include a prize_id' });
    }
    if (!validToken) {
      return res.status(400).json({ message: 'Invalid fan token' });
    }
    if (body.update_profile) {
      await updateProfile(strippedFanPartial);
    }
    await redeemPrizeCodeForFan(body);
    return res.json({ message: 'Prize Code Redeemed!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
