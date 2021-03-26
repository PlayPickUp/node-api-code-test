import * as Sentry from '@sentry/node';

export const pickupErrorHandler = (err: unknown): void => {
  console.error(err);
  Sentry.captureException(err);
};
