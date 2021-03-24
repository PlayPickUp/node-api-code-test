import warehouse_db_knex from '../util/db';
import { LogEvent } from '../models/events.model';

export const createNewEvent = async (event: LogEvent): Promise<void> => {
  try {
    await warehouse_db_knex('events')
      .insert({
        name: event.name,
        event_timestamp: event.event_timestamp || new Date().toISOString(),
        metadata: event.metadata,
      })
      .catch((err: string) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
    return;
  }
  return;
};
