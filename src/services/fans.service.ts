import head from 'lodash/head';
import filter from 'lodash/filter';
import ShortUniqueId from 'short-unique-id';
import { PUServerEvents } from '@playpickup/server-events';

import knex from '../util/db';
import { Fan, FanPick, PrizePurchaseRequest } from '../models/fans.model';
import { pickupErrorHandler } from '../helpers/errorHandler';
import { getPicks } from './picks.service';
import { Pick } from '../models/picks.model';
import ipLookup from '../helpers/ipLookup';
import { calculateMoneyline, calculatePoints } from '../helpers/calculations';

import { CreateFanPick } from '../types';
export interface PickerPick {
  id: string | number;
  fan_count: number;
}

const { MIXPANEL_TOKEN, NODE_ENV } = process.env;

const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');
const uid = new ShortUniqueId();

export const purchasePrizeForFan = async (
  request: PrizePurchaseRequest
): Promise<void> => {
  try {
    const pointsBalance: number = await knex('fans')
      .select('marketplace_pts')
      .where('id', '=', request.fan_id)
      .first()
      .then((data: Partial<Fan>) => {
        return data.marketplace_pts;
      });
    const newBalance = pointsBalance - request.points_cost;
    if (newBalance < 0) {
      throw new Error('Insufficient Funds');
    }

    await knex('fans')
      .where('id', '=', request.fan_id)
      .update({ marketplace_pts: newBalance });
  } catch (err) {
    console.error(err);
    throw err;
  }
  return;
};

export const updateProfile = async (fanUpdate: Partial<Fan>): Promise<Fan> => {
  try {
    return knex('fans')
      .where({ id: fanUpdate.id })
      .update({
        ...fanUpdate,
        updated_at: new Date().toISOString(),
      });
  } catch (err) {
    console.error('Unable to update Fan profile');
    throw err;
  }
};

export const fanIdMatchesToken = async (
  fanPartial: Partial<Fan>
): Promise<boolean> => {
  return await knex('fans')
    .select('persistence_token')
    .where({ id: fanPartial.id })
    .first()
    .then((data: Partial<Fan>) => {
      return data.persistence_token === fanPartial.persistence_token;
    });
};

const getFanPickCount = async (pickId: number): Promise<number | null> => {
  const record = await knex('picks')
    .select('fan_picks_count')
    .where({ id: pickId });

  const fanPick = head<{ fan_picks_count: number }>(record);
  if (!fanPick) {
    throw new Error('[getFanPickCount]: could not get fan pick');
  }
  return fanPick.fan_picks_count;
};

export const createFanPick = async (
  payload: CreateFanPick
): Promise<Pick[] | void> => {
  try {
    const picks = await getPicks(0, 25, Number(payload.prop_id));
    if (!picks || picks.length < 1) {
      throw new Error('Could not find pick during fan pick creation!');
    }

    const pickId = payload.pick_id;
    const selectedPick = head(filter(picks, { id: pickId }));

    if (!selectedPick) {
      throw new Error(
        '[createFanPick]: Could not get selected pick by user, bailing!'
      );
    }

    const frozen_fan_pick_popularity = selectedPick.pick_popularity;
    const moneyline = calculateMoneyline(frozen_fan_pick_popularity);
    const frozen_points = calculatePoints(moneyline);
    const userLocationInfo = await ipLookup(payload.ip_address);

    const insert: FanPick = {
      fan_id: Number(payload.fan_id) || null,
      pick_id: Number(payload.pick_id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      prop_id: Number(payload.prop_id),
      frozen_fan_pick_popularity,
      short_url: uid.randomUUID(7),
      frozen_points,
      graded_at: null,
      graded_sms_sent_at: null,
      claimed_sms_sent_at: null,
      source_url: payload.source_url,
      publisher_id: Number(payload.publisher_id),
      ip_address: payload.ip_address || null,
      zip_code: (userLocationInfo && userLocationInfo.postal) || null,
      state: (userLocationInfo && userLocationInfo.region) || null,
      city: (userLocationInfo && userLocationInfo.city) || null,
      country: (userLocationInfo && userLocationInfo.country) || null,
      time_zone: (userLocationInfo && userLocationInfo.timezone) || null,
      geo_location: (userLocationInfo && userLocationInfo.loc) || null,
    };

    // create the fanpick and return the pick id
    const createPick = await knex('fan_picks').insert(insert);

    if (!createPick) {
      throw new Error('[fans.service]: Could not create fan_pick record');
    }

    if (!payload.fan_id) {
      tracker.captureEvent('fan_pick_pre_verify_not_logged_in', null, {
        ...payload,
        ...insert,
      });
    } else {
      tracker.captureEvent('fan_pick_pre_verify_logged_in', payload.fan_id, {
        ...payload,
        ...insert,
      });
    }

    const fanPickCount = await getFanPickCount(Number(pickId));

    const updatedFanPickCount = fanPickCount === null ? 2 : fanPickCount + 1;

    await knex('picks')
      .where({ id: Number(pickId) })
      .update({ fan_picks_count: updatedFanPickCount });

    tracker.captureEvent('pick_fan_count_updated', null, {
      ...selectedPick,
      new_fan_pick_value: updatedFanPickCount,
    });

    const refreshedPicks = await getPicks(0, 25, Number(payload.prop_id));
    if (!refreshedPicks || refreshedPicks.length < 1) {
      throw new Error(
        '[refreshedPicks]: Could not find pick during fan pick creation!'
      );
    }

    return refreshedPicks;
  } catch (err) {
    pickupErrorHandler(err);
  }
};
