import * as pg from 'pg';

const DB = process.env.NODE_READ_ONLY_URL;
const NODE_ENV = process.env.NODE_ENV;

pg.defaults.ssl = {
  rejectUnauthorized: false,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require('knex')({
  client: 'pg',
  connection: DB,
  debug: NODE_ENV === 'development',
  ssl: { sslmode: 'require', rejectUnauthorized: false },
});

export default knex;
