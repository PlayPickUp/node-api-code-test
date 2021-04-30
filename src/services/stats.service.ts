import knex from '../util/db';
import moment from 'moment';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';

interface PostPublish {
  id: string | number;
  published_at: Date;
}

export const postsByDay = async (): Promise<Record<string, number>[]> => {
  const posts = await knex('posts')
    .select('id', 'published_at')
    .whereNot({ publisher_id: null })
    .orderBy('published_at', 'asc');

  if (!posts) {
    throw new Error('Could not get posts from database');
  }
  if (posts.name === 'Error') {
    throw new Error(posts.message);
  }

  const initialDates: string[] = posts.map((post: PostPublish) =>
    moment(post.published_at).format('MM/DD/YYYY').toString()
  );

  const dates = uniq(initialDates);

  const grouped = dates.map((date) => {
    const filterPosts = filter(
      posts,
      (o: PostPublish) => moment(o.published_at).format('MM/DD/YYYY') === date
    );
    return {
      [date]: filterPosts.length,
    };
  });

  return grouped;
};
