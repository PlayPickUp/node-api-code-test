import axios from 'axios';
import { PUServerEvents } from '@playpickup/server-events';

import { pickupErrorHandler } from '../errorHandler';

const { KASPER_URL, ADMIN_TOKEN, MIXPANEL_TOKEN, NODE_ENV } = process.env;
const KASPER = process.env[KASPER_URL || ''];

const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

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
    tracker.captureEvent('featured_img_sent_to_kasper', null, {
      post_id,
      url,
      data: response.data,
    });
    return response.data;
  } catch (err) {
    tracker.captureEvent('featured_img_sent_to_kasper_error', null, {
      post_id,
      url,
      err,
    });
    pickupErrorHandler(err);
  }
};
