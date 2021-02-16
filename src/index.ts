import express, {Request, Response} from 'express';
import cors, {CorsOptions} from 'cors';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import path from 'path';

import propsRouter from './routes/props.routes';
import publishersRouter from './routes/publishers.routes';
import postsRouter from './routes/posts.routes';
import leaguesRouter from './routes/leagues.routes';
import {httpErrorHandler} from './middleware/httpError.middleware';
import {forbiddenErrorHandler} from './middleware/forbiddenError.middleware';
import {notFoundErrorHandler} from './middleware/notFoundError.middleware';
import {corsWhitelistDev, corsWhitelistProd} from './constants/corsWhitelist';
import loginRouter from './routes/login.routes';
import passport from 'passport';
import Strategy from 'passport-auth-token';
import {findPublisherByAccessToken} from './services/publishers.service';
import ForbiddenException from './exceptions/forbidden.exception';

const app = express();
const port = process.env.PORT || 3001;
const { NODE_ENV } = process.env;

// various configs/use
const corsConfig: CorsOptions = {
  origin: NODE_ENV !== 'production' ? corsWhitelistDev : corsWhitelistProd,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsConfig));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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

// health check
app.get('/health', (req: Request, res: Response) => res.sendStatus(200));

// error handlers
app.use(httpErrorHandler);
app.use(forbiddenErrorHandler);

// 404 error handler (must be last)
app.use(notFoundErrorHandler);

app.listen(port, () => {
  console.log(`PickUp API listening on ${port}`);
});
