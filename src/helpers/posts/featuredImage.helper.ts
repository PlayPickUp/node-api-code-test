import axios from 'axios';

import { pickupErrorHandler } from '../errorHandler';

const { KASPER_URL, ADMIN_TOKEN } = process.env;
const KASPER = process.env[KASPER_URL || ''];

export const generateFeaturedImg = async (
  post_id: string | number,
  url: string
): Promise<void> => {
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
    pickupErrorHandler(err);
  }
};
