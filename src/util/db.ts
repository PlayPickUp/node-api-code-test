import * as pg from 'pg';

const DATABASE_PROVIDER = process.env.DATABASE_PROVIDER || 'DATABASE_URL';
const NODE_ENV = process.env.NODE_ENV;
const DB_URL = process.env[DATABASE_PROVIDER];
const WAREHOUSE_DB_URL = process.env.DATA_WAREHOUSE_URL;

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
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const warehouse_db_knex = require('knex')({
  client: 'pg',
  connection: WAREHOUSE_DB_URL,
  debug: NODE_ENV === 'development',
  ssl: NODE_ENV !== 'development' && {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
});

export default knex;
