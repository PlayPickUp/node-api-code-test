import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors, { CorsRequest } from 'cors';
import express, { Request, Response } from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import ForbiddenException from './exceptions/forbidden.exception';
import Strategy from 'passport-auth-token';
import leaguesRouter from './routes/leagues.routes';
import loginRouter from './routes/login.routes';
import passport from 'passport';
import postsRouter from './routes/posts.routes';
import propsRouter from './routes/props.routes';
import publishersRouter from './routes/publishers.routes';
import usersRouter from './routes/users.routes';
import { dsn } from './constants/sentry';
import { findPublisherByAccessToken } from './services/publishers.service';
import { forbiddenErrorHandler } from './middleware/forbiddenError.middleware';
import { httpErrorHandler } from './middleware/httpError.middleware';
import { notFoundErrorHandler } from './middleware/notFoundError.middleware';
import { publicCorsConfig } from './util/corsOptions';

const { NODE_ENV } = process.env;

const app = express();
const port = process.env.PORT || 3001;

Sentry.init({
  dsn,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: NODE_ENV !== 'production' ? 1.0 : 0.5,
});

app.use(morgan('combined'));
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(helmet());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.options('*', cors<CorsRequest>());

passport.use(
  'publishertoken',
  new Strategy(async function (token, done) {
    const publisher = await findPublisherByAccessToken(token);
    if (publisher) {
      return done(null, publisher);
    } else {
      return done(
        new ForbiddenException('No valid publisher access token provided')
      );
    }
  })
);

passport.use(
  'admintoken',
  new Strategy(async function (token, done) {
    if (token && token === process.env.ADMIN_TOKEN) {
      return done(null, token);
    } else {
      return done(
        new ForbiddenException('No valid admin access token provided')
      );
    }
  })
);

// api routes
app.use('/v1', propsRouter);
app.use('/v1', publishersRouter);
app.use('/v1', postsRouter);
app.use('/v1', leaguesRouter);
app.use('/v1', loginRouter);
app.use('/v1', usersRouter);

// health check
app.get('/health', cors(publicCorsConfig), (req: Request, res: Response) =>
  res.sendStatus(200)
);

// This error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// error handlers
app.use(httpErrorHandler);
app.use(forbiddenErrorHandler);

// 404 error handler (must be last)
app.use(notFoundErrorHandler);

app.listen(port, () => {
  console.log(`PickUp API listening on ${port}`);
});
