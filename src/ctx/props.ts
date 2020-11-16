import { Prop } from '../types';
import knex from '../util/db';

// Get props
export const getProps = async (
  limit: string | undefined = '75',
  offset: string | undefined = '0'
): Promise<Prop[] | void> => {
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
};
