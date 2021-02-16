import knex from '../util/db';
import {Publisher} from '../models/publishers.model';
import NotFoundException from '../exceptions/notFound.exception';
import BadRequestException from '../exceptions/badRequest.exception';

export const findPublisherByAccessToken = async (
  token: string
): Promise<Publisher | void> => {
  try {
    if (!token) {
      throw new BadRequestException('Must provide a valid access token!');
    }
    const publisher: Publisher = knex
      .select()
      .from('publishers')
      .where({ access_token: token })
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
