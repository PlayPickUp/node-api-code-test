import knex from '../util/db';
import head from 'lodash/head';
import { pickupErrorHandler } from '../helpers/errorHandler';
import { Pick } from '../models/picks.model';
import omit from 'lodash/omit';

export const getPickStateByProp = async (
  prop_id: string | number
): Promise<null | Record<string, string>> => {
  const pick_prop = await knex('picks_props')
    .select('pick_id')
    .where({ prop_id })
    .limit(1);
  if (!pick_prop) throw new Error('Could not get picks_props');
  if (pick_prop.name === 'Error') {
    console.error(pick_prop.message);
    throw new Error(pick_prop.message);
  }

  const pickId: Record<string, string> | undefined = head(pick_prop);

  if (!pickId) {
    return null;
  }

  const pick = await knex('picks')
    .select('id', 'state')
    .where({ id: pickId.pick_id });

  return pick;
};

export const getPicks = async (
  offset = 0,
  limit = 25,
  prop_id?: string | number
): Promise<Pick[] | null> => {
  try {
    if (!prop_id) {
      const picks: Pick[] = await knex()
        .select()
        .from('picks')
        .offset(offset)
        .limit(limit)
        .orderBy('created_at', 'desc')
        .catch((err: Error) => {
          throw err;
        });
      if (!picks) throw new Error('Could not get Picks');

      return picks;
    } else {
      const picks = await knex('picks_props as pp')
        .select('*', 'pp.title as display_title')
        .rightJoin('picks as p', 'pp.pick_id', 'p.id')
        .offset(offset)
        .limit(limit)
        .orderBy('created_at', 'desc')
        .where({ prop_id })
        .catch((err: Error) => {
          throw err;
        });

      const transformedPicks = picks.map((pick: Pick) =>
        omit(pick, ['prop_id', 'pick_id'])
      );
      return transformedPicks;
    }
  } catch (err) {
    pickupErrorHandler(err);
    return null;
  }
};
