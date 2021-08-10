import * as pg from 'pg';

const { CODE_TEST_DB, NODE_ENV } = process.env; // Database connection string

if (NODE_ENV === 'development') {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require('knex')({
  client: 'pg',
  connection: CODE_TEST_DB,
  debug: NODE_ENV === 'development',
  ssl: NODE_ENV === 'development' && {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
});

export default knex;
