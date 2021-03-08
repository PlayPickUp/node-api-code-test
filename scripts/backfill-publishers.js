/* eslint-disable */
// @ts-nocheck
const pg = require('pg');
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

const updateRecords = async () => {
  try {
    const posts = await knex('posts')
      .select()
      .catch((err) => {
        throw new Error(err);
      });

    console.log('Got the posts to modify');

    const updatePosts = async (posts) => {
      const updates = async () =>
        await Promise.all(
          posts.map(async (post) => {
            await knex('posts')
              .where({ id: post.id })
              .update({ league: JSON.stringify({ leagues: post.league }) })
              .catch((err) => console.error(err));
          })
        );
      await updates();
    };

    await updatePosts(posts)
      .then(() => console.log('Done Processing'))
      .catch((err) => console.error(err));

    console.log('Finished updating...');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateRecords();
