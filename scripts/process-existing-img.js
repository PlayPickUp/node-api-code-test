/* eslint-disable */
// @ts-nocheck
const pg = require('pg');
require('dotenv').config();
const axios = require('axios');

const DATABASE_PROVIDER = process.env.DATABASE_PROVIDER || 'DATABASE_URL';
const NODE_ENV = process.env.NODE_ENV;
const DB_URL = process.env[DATABASE_PROVIDER];
const { KASPER_URL, ADMIN_TOKEN } = process.env;
const KASPER = process.env[KASPER_URL || ''];

if (NODE_ENV !== 'development') {
  pg.defaults.ssl = {
    rejectUnauthorized: false,
  };
}

const generateFeaturedImg = async (post_id, url) => {
  if (!url) {
    console.warn('No featured image URL supplied, bailing!');
    return;
  }
  try {
    const response = await axios
      .post(
        `${KASPER}/img-processor`,
        { post_id, image_url: url },
        { params: { token: ADMIN_TOKEN } }
      )
      .catch((err) => {
        throw err;
      });
    if (!response || !response.data) {
      throw new Error('Could not get response from Kasper!');
    }
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

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
      .where({ deleted_at: null })
      .catch((err) => {
        throw new Error(err);
      });

    console.log('Got the posts to modify');

    const updatePosts = async (posts) => {
      const updates = async () =>
        await Promise.all(
          posts.map(async (post) => {
            generateFeaturedImg(post.id, post.featured_img);
          })
        );
      await updates();
    };

    await updatePosts(posts)
      .then(() => console.log('Done Processing'))
      .catch((err) => console.error(err));

    console.log('Finished updating...');
    // process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateRecords();
