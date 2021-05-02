import knex from '../util/db';
import head from 'lodash/head';

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
