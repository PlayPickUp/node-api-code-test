import { Request, Response } from 'express';
import { PUServerEvents } from '@playpickup/server-events';

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

const { NODE_ENV, MIXPANEL_TOKEN } = process.env;
const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const getPrizes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const prizes = await listAllPrizes();
    tracker.captureEvent('prizes_queried', null, { prizes });
    return res.json(prizes);
  } catch (err) {
    tracker.captureEvent('prizes_queried_error', null, { err });
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
    tracker.captureEvent('fan_redemption_date_checked', fanId, {
      ...query,
      dates,
    });
    return res.json(dates);
  } catch (err) {
    tracker.captureEvent(
      'fan_redemption_date_checked_error',
      (query && query.fanId && Number(query.fanId)) || null,
      {
        ...query,
        err,
      }
    );
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
    tracker.captureEvent('prize_created', null, { ...prize });
    return res.json({ message: 'Created' });
  } catch (err) {
    tracker.captureEvent('prize_created_error', null, { ...body, err });
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
    tracker.captureEvent('prize_code_added', null, { ...body, ...response });
    return res.json(response);
  } catch (err) {
    tracker.captureEvent('prize_code_added_error', null, { ...body, err });
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
      first_name: body.fan.first_name,
      last_name: body.fan.last_name,
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
    tracker.captureEvent(
      'prize_redeemed',
      (strippedFanPartial && strippedFanPartial.id) || null,
      {
        ...strippedFanPartial,
        ...body,
      }
    );
    return res.json({ message: 'Prize Code Redeemed!' });
  } catch (err) {
    tracker.captureEvent(
      'prize_redeemed_error',
      (body && body.fan && body.fan.id) || null,
      { ...body, err }
    );
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
