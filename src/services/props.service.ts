import head from 'lodash/head';

import knex from '../util/db';
import { epochNow, epochNowPlus48 } from '../util/epochConverts';
import { Prop } from '../models/prop.model';
import { pickupErrorHandler } from '../helpers/errorHandler';
import { getPicks } from './picks.service';

// Get props
export const getProps = async (
  limit: string | undefined = '75',
  offset: string | undefined = '0',
  id: string,
  picks = 'true'
): Promise<Prop[] | Prop | void> => {
  const showPicks = picks.toLowerCase() === 'true' ? true : false;
  if (id) {
    try {
      const prop: Prop[] = await knex.select().from('props').where({ id });
      if (!prop) {
        throw new Error('Could not get props');
      }

      if (!showPicks) {
        return prop;
      } else {
        const pickedProp = head(prop);
        if (!pickedProp) {
          throw new Error('Could not get singular prop to fetch picks');
        }
        const picks = await getPicks(0, 25, pickedProp?.id);
        const payload = [{ ...pickedProp, picks }];
        return payload;
      }
    } catch (err) {
      pickupErrorHandler(err);
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

      if (!showPicks) {
        return props;
      } else {
        const payload = await Promise.all(
          props.map(async (prop) => {
            const picks = await getPicks(0, 25, prop.id);
            return { ...prop, picks };
          })
        );
        return payload;
      }
    } catch (err) {
      pickupErrorHandler(err);
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
    pickupErrorHandler(err);
  }
};
