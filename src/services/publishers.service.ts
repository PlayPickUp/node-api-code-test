import knex from '../util/db';
import { Publisher } from '../models/publishers.model';
import NotFoundException from '../exceptions/notFound.exception';
import BadRequestException from '../exceptions/badRequest.exception';
import { captureException } from '@sentry/minimal';
import moment from 'moment';
import { Post } from '../models/posts.model';

export const findPublisherByAccessToken = async (
  access_token: string
): Promise<Publisher | void> => {
  try {
    if (!access_token) {
      throw new BadRequestException('Must provide a valid access token!');
    }
    const publisher: Publisher = await knex
      .select()
      .from('publishers')
      .where({ access_token })
      .first();
    if (!publisher) {
      throw new NotFoundException(
        'Could not find publisher with the specified access token'
      );
    }
    return publisher;
  } catch (err) {
    console.error(err.message);
  }
};

export const delPost = async (
  publisher_id: number,
  post_id: number
): Promise<Post[]> => {
  const post: Post[] = await knex('posts')
    .where({ id: post_id, publisher_id })
    .update({ deleted_at: moment().toISOString() })
    .returning('*')
    .catch((err: Error) => {
      captureException(err);
    });

  return post;
};
