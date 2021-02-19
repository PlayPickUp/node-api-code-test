const { NODE_ENV } = process.env;

export const dsn =
  NODE_ENV !== 'production'
    ? 'https://693ec4ede08349648d4c4914c2135506@o527352.ingest.sentry.io/5643544'
    : '';
