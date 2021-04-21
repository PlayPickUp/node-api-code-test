import knex from '../util/db';
import { Fan, PrizePurchaseRequest } from '../models/fans.model';

export const purchasePrizeForFan = async (
  request: PrizePurchaseRequest
): Promise<void> => {
  try {
    const pointsBalance: number = await knex('fans')
      .select('points')
      .where('id', '=', request.fan_id)
      .first()
      .then((data: Partial<Fan>) => {
        return data.points;
      });
    const newBalance = pointsBalance - request.points_cost;
    if (newBalance < 0) {
      throw new Error('Insufficient Funds');
    }

    await knex('fans')
      .where('id', '=', request.fan_id)
      .update({ points: newBalance });
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
