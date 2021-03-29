/* eslint-disable */
// @ts-nocheck
const pg = require('pg');
require('dotenv').config();
const moment = require('moment');
const _ = require('lodash');
const { pick } = require('lodash');

const DATABASE_PROVIDER = process.env.DATABASE_PROVIDER || 'DATABASE_URL';
const NODE_ENV = process.env.NODE_ENV;
const DB_URL = process.env[DATABASE_PROVIDER];

if (NODE_ENV !== 'development') {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require('knex')({
  client: 'pg',
  connection: DB_URL,
  debug: NODE_ENV === 'development',
  ssl: NODE_ENV !== 'development' && {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
});

const updateRecords = async () => {
  try {
    const props = await knex('props')
      .select('*')
      .orderBy('id', 'desc')
      .whereNotIn('league', ['mlb', 'nfl', 'cbb', 'mma', 'mlb', 'pll', 'nba'])
      .catch((err) => {
        throw new Error(err);
      });

    console.log('Got the posts to modify');

    const updateProps = async (props) => {
      const updates = async () =>
        await Promise.all(
          props.map(async (prop) => {
            console.log(prop.id);
            await knex('props')
              .where({ id: prop.id })
              .update({
                close_at: moment('03/24/2021', 'MM/DD/YYYY').toISOString(),
                close_time: moment('03/24/2021', 'MM/DD/YYYY').toISOString(),
              })
              .catch((err) => console.error(err));

            const picks = await knex('picks_props')
              .select('pick_id')
              .where({ prop_id: prop.id })
              .catch((err) => console.error(err));

            console.log(`${picks.length} picks to close`);
            console.log(picks);

            await picks.map(async (pick) => {
              const pick_id = pick.pick_id;
              console.log('PICK ID => ', pick.pick_id);
              await knex('picks')
                .where({ id: pick_id })
                .update({ state: 'closed' })
                .catch((err) => console.error(err));
            });
          })
        );
      await updates();
      console.log('Total Props =>', props.length);
    };

    await updateProps(props)
      .then(() => console.log('Done Processing'))
      .catch((err) => console.error(err));

    console.log('Finished updating...');
    // process.exit(0); this was fuckin' up my shit
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateRecords();
