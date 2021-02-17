import knex from '../util/db';
import {epochNow, epochNowPlus48} from '../util/epochConverts';
import {Prop} from '../models/prop.model';

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

// Props Closing within 48 Hours
export const getClosingProps = async (): Promise<Prop[] | void> => {
  const now = epochNow;
  const cap = epochNowPlus48; // 48 hours out

  try {
    const props: Prop[] = await knex
      .select()
      .from('props')
      .whereNotNull('close_time')
      .whereBetween('close_time', [now, cap])
      .catch((err: any) => {
        throw new Error(err);
      });

    return props;
  } catch (err) {
    console.error(err);
  }
};
