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

const updateCfbRecords = async () => {
  try {
    const postsCfb = await knex('posts')
      // assuming you have a column named 'league' and a json column { leagues: cfb }
      // same as "select * from table where league->>'leagues' = 'cfb'"
      .whereRaw("??->>'leagues' = 'cfb'", ['league'])
      .orderBy('id', 'desc')
      .catch((err) => {
        throw new Error(err);
      });

    console.log('Got the posts to pull, now to update them');

    const updateCfbPosts = async (posts) => {
      const updates = async () =>
        await Promise.all(
          posts.map(async (post) => {
            console.log(post.id);
            await knex('posts')
              .where({ id: post.id })
              .update({
                league: { leagues: 'ncaaf' },
              })
              .catch((err) => console.error(err));
          })
        );
      await updates();
      console.log('Total posts =>', posts.length);
    };

    await updateCfbPosts(postsCfb)
      .then(() => console.log('Done Processing'))
      .catch((err) => console.error(err));

    console.log('Finished updating...');
    // process.exit(0); // this was fuckin' up my shit
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const updateCbbRecords = async () => {
  try {
    const postsCbb = await knex('posts')
      .whereRaw("??->>'leagues' = 'cbb'", ['league'])
      .orderBy('id', 'desc')
      .catch((err) => {
        throw new Error(err);
      });

    console.log('Got the posts to pull, now to update them');

    const updateCbbPosts = async (posts) => {
      const updates = async () =>
        await Promise.all(
          posts.map(async (post) => {
            console.log(post.id);
            await knex('posts')
              .where({ id: post.id })
              .update({
                league: { leagues: 'ncaab' },
              })
              .catch((err) => console.error(err));
          })
        );
      await updates();
      console.log('Total posts =>', posts.length);
    };

    await updateCbbPosts(postsCbb)
      .then(() => console.log('Done Processing'))
      .catch((err) => console.error(err));

    console.log('Finished updating...');
    process.exit(0); // this was fuckin' up my shit
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateCfbRecords();
updateCbbRecords();
