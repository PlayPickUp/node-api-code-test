import knex from '../util/db';

import { Prop } from '../models/prop.model';

// Get props
export const getProps = async (): Promise<any> => {
  /*
    Use this method to get props from the database. Currently we use Knex to interact with our DB in Node/JS.
    You may use Knex.Js (which is already imported for you and ready to go) or whatever you are comfortable with for
    this test.
  */
  const props = [{ id: 32 }, { id: 4556 }]; // <- replace this with your database query
  return props;
};
