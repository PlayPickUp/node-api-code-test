import { Prop } from '../types';
import knex from '../util/db';

// Get props
export const getProps = async (
  limit: string | undefined = '75',
  offset: string | undefined = '0',
  id: string
): Promise<Prop[] | Prop | void> => {
  if (id) {
    try {
      const prop: Prop = await knex.select().from('props').where({ id });
      if (!prop) {
        throw new Error('Could not get props');
      }
      return prop;
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      const props: Prop[] = await knex
        .select()
        .from('props')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset);
      if (!props) {
        throw new Error('Could not get props');
      }
      return props;
    } catch (err) {
      console.error(err);
    }
  }
};
