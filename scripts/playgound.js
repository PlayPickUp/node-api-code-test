/* eslint-disable */
// @ts-nocheck
const pg = require('pg');
const moment = require('moment');
const _ = require('lodash');

require('dotenv').config();

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

// how many publishers posted during 4/26 -> 5/2
const getPublishers = async () => {
  const publishers = await knex('posts')
    .select('publisher_id')
    .where({ deleted_at: null })
    .whereBetween('published_at', [
      moment('04/26/2021').toISOString(),
      moment('05/02/2021').toISOString(),
    ]);
  const publishersPosted = _.uniqBy(publishers, 'publisher_id');

  const count = async () =>
    await Promise.all(
      publishersPosted.map(async (publisher) => {
        const publisher_posts = await knex('posts')
          .select('publisher_name', 'post_title')
          .where({ deleted_at: null, publisher_id: publisher.publisher_id })
          .whereBetween('published_at', [
            moment('04/26/2021').toISOString(),
            moment('05/02/2021').toISOString(),
          ]);
        console.log(
          `${_.head(publisher_posts).publisher_name}: ${publisher_posts.length}`
        );
      })
    );
  await count();
};

getPublishers();
