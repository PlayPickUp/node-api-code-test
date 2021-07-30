import knex from '../util/db';
import {
  CreatePrizeCodesRequest,
  CreatePrizeCodesResponse,
  CreatePrizeRequest,
  Prize,
  PrizeCode,
  PrizeRedemption,
  RedeemPrizeCodesRequest,
  RedemptionDateDTO,
} from '../models/prizes.model';
import { purchasePrizeForFan } from './fans.service';
import moment from 'moment';
import axios from 'axios';
import head from 'lodash/head';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const KASPER_PROVIDER = process.env.KASPER_URL || '';
const KASPER_URL = process.env[KASPER_PROVIDER];

export const listAllPrizes = async (): Promise<Prize[]> => {
  const prizes = await knex.select('*').from('prizes').orderBy('id', 'desc');
  if (!prizes) {
    throw new Error('Could not retrieve prizes from API!');
  }
  if (prizes.name === 'Error') {
    throw new Error(prizes.message);
  }
  return prizes;
};

export const getPrizeById = async (prizeId: number): Promise<Prize> => {
  try {
    return await knex('prizes').select('*').where('id', '=', prizeId).first();
  } catch (err) {
    console.error("Couldn't find prize by ID: " + prizeId);
    throw err;
  }
};

export const getRedemptionDatesForFan = async (
  fanId: number
): Promise<RedemptionDateDTO[]> => {
  try {
    const prizeRedemptions: PrizeRedemption[] = await knex
      .select(
        'prize_id',
        'fan_id',
        'prize_code_id',
        'redeemed_at',
        'min_days_between_redemptions'
      )
      .from(
        knex('prize_redemptions')
          .select()
          .distinctOn('prize_id')
          .where('fan_id', '=', fanId)
          .orderByRaw('prize_id, redeemed_at DESC')
          .as('pr')
      )
      .join('prizes', 'prizes.id', 'pr.prize_id')
      .orderBy('redeemed_at', 'desc')
      .then((data: PrizeRedemption[]) => {
        return data;
      })
      .catch((err: Error) => {
        console.error(err);
      });

    const redemptionDates: RedemptionDateDTO[] = await Promise.all(
      prizeRedemptions.map(async (redemption: PrizeRedemption) => {
        return {
          prizeId: redemption.prize_id.toString(),
          nextRedemption: await getNextRedemptionDate(
            fanId,
            redemption.prize_id,
            redemption.redeemed_at,
            redemption.min_days_between_redemptions
          ).then((data: Date) => {
            return moment(data).toISOString();
          }),
        };
      })
    );

    return redemptionDates;
  } catch (err) {
    console.error("Couldn't get redemption dates for fan: " + fanId);
    throw err;
  }
};

export const createNewPrize = async (
  createPrizeReq: CreatePrizeRequest
): Promise<Prize> => {
  const prize = await knex('prizes')
    .insert({
      ...createPrizeReq,
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    })
    .catch((err: string) => {
      throw new Error(err);
    });
  if (!prize) {
    throw new Error(
      'Unable to create prize: ' + JSON.stringify(createPrizeReq)
    );
  }
  if (prize.name === 'Error') {
    throw new Error(prize.message);
  }
  return prize;
};

export const createNewPrizeCodes = async (
  createPrizeCodesReq: CreatePrizeCodesRequest
): Promise<CreatePrizeCodesResponse> => {
  const response: CreatePrizeCodesResponse = {
    created: 0,
    failed: [],
  };

  const firstCode = head(createPrizeCodesReq.codes);
  const firstPin = head(createPrizeCodesReq.pins);

  await Promise.all(
    createPrizeCodesReq.codes.map(async (code, i) => {
      try {
        if (createPrizeCodesReq.same_length && firstCode) {
          if (code.length !== firstCode.length) {
            throw new Error('One or more codes is not the correct length!');
          }
          if (firstPin) {
            if (createPrizeCodesReq.pins[i].length !== firstPin.length) {
              throw new Error('One or more pins is not the correct length!');
            }
          }
        }
        const pins = firstPin ? createPrizeCodesReq.pins[i] : null;
        await knex('prize_codes')
          .insert({
            code,
            pin: pins,
            expiration_date: createPrizeCodesReq.expiration_date,
            prize_id: createPrizeCodesReq.prize_id,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          })
          .returning(['id', 'code', 'pin'])
          .catch((err: string) => {
            throw new Error(err);
          });
        response.created++;
      } catch (e) {
        response.failed.push(code);
        createPrizeCodesReq.pins
          ? response.failed.push(createPrizeCodesReq.pins[i])
          : null;
        response.message = e.toString();
      }
    })
  );
  return response;
};

export const redeemPrizeCodeForFan = async (
  redeemPrizeCodeRequest: RedeemPrizeCodesRequest
): Promise<void> => {
  await validateFanIsEligibleForPrize(redeemPrizeCodeRequest);
  const prizeCode: PrizeCode = await getRedeemablePrizeCode(
    redeemPrizeCodeRequest.prize_id
  );
  await assignCodeToFan(prizeCode, redeemPrizeCodeRequest.fan.id);
  const prize: Prize = await getPrizeById(redeemPrizeCodeRequest.prize_id).then(
    (data: Prize) => {
      return data;
    }
  );
  try {
    await axios({
      method: 'post',
      url: `${KASPER_URL}/emails/prize-redemption`,
      data: {
        prize,
        prizeCode,
        fan: redeemPrizeCodeRequest.fan,
      },
      params: {
        token: ADMIN_TOKEN,
      },
    })
      .then(async () => {
        await purchasePrizeForFan({
          fan_id: redeemPrizeCodeRequest.fan.id,
          points_cost: prize.points_cost,
        });
      })
      .catch((error) => {
        console.error('Failed to send prize email to Kasper! ', error);
        throw error;
      });
  } catch (e) {
    console.error('failed to purchase prize code for fan');
    await unassignPrizeCode(prizeCode);
    throw e;
  }
};

const validateFanIsEligibleForPrize = async (
  request: RedeemPrizeCodesRequest
) => {
  const lastRedemption: Date | null = await getLastRedemptionDate(
    request.fan.id,
    request.prize_id
  );

  if (!lastRedemption) return; //First time purchase, no need to validate further

  const prizePeriod = await knex('prizes')
    .where('id', '=', request.prize_id)
    .first()
    .then((data: Prize) => {
      return data.min_days_between_redemptions;
    });

  if (prizePeriod === null || prizePeriod < 1) return; //No limit on redemptions

  const nextEligibleRedeemDate: Date = await getNextRedemptionDate(
    request.fan.id,
    request.prize_id
  );
  if (nextEligibleRedeemDate.getTime() > Date.now()) {
    throw new Error('Fan is not yet eligible to redeem this prize again');
  }
};

const getNextRedemptionDate = async (
  fanId: number,
  prizeId: number,
  lastRedemption?: Date,
  prizePeriod?: number
): Promise<Date> => {
  if (!lastRedemption) {
    const lastRedemption: Date | null = await getLastRedemptionDate(
      fanId,
      prizeId
    );
    if (!lastRedemption) {
      return moment('2020-01-01').toDate(); // can redeem immediately; any past date is acceptable
    }
  }

  if (!prizePeriod) {
    const prizePeriod: number = await knex('prizes')
      .where('id', '=', prizeId)
      .first()
      .then((data: Prize) => {
        return data.min_days_between_redemptions;
      });
    if (!prizePeriod || prizePeriod < 1) {
      return moment('2020-01-01').toDate(); // can redeem immediately; any past date is acceptable
    }
  }

  return moment(lastRedemption).add(prizePeriod, 'days').toDate();
};

const getLastRedemptionDate = async (
  fanId: number,
  prizeId: number
): Promise<Date | null> => {
  return await knex('prize_redemptions')
    .select('redeemed_at')
    .where('fan_id', '=', fanId)
    .andWhere('prize_id', '=', prizeId)
    .orderBy('redeemed_at', 'desc')
    .limit(1)
    .then((data: Partial<PrizeRedemption>[]) => {
      if (data.length < 1) {
        return null;
      }
      return data[0].redeemed_at;
    });
};

const assignCodeToFan = async (
  prizeCode: PrizeCode,
  fanId: number
): Promise<PrizeCode> => {
  const redeemDateString: string = new Date().toISOString();
  return knex('prize_redemptions')
    .insert({
      fan_id: fanId,
      prize_code_id: prizeCode.id,
      redeemed_at: redeemDateString,
      prize_id: prizeCode.prize_id,
    })
    .then(async (data: PrizeCode) => {
      if (!data) throw new Error('Unable to assign PrizeCode to Fan');
      return data;
    });
};

const unassignPrizeCode = async (prizeCode: PrizeCode): Promise<PrizeCode> => {
  return await knex('prize_redemptions')
    .where('prize_code_id', '=', prizeCode.id)
    .del()
    .then((data: PrizeCode) => {
      if (!data) throw new Error('Unable to un-assign PrizeCode');
      return data;
    });
};

const getRedeemablePrizeCode = async (prizeId: number): Promise<PrizeCode> => {
  const ninetyDaysFromNow: Date = moment().add(90, 'days').toDate();
  return await knex('prize_codes')
    .select()
    .whereNotExists(
      knex('prize_redemptions')
        .select()
        .whereRaw('prize_codes.id = prize_redemptions.prize_code_id')
    )
    .andWhere('prize_id', '=', prizeId)
    .andWhere('expiration_date', '>', ninetyDaysFromNow)
    .first()
    .then(async (data: PrizeCode) => {
      if (!data) throw new Error('No Redeemable prize code available');
      return data;
    });
};
