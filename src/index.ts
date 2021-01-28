import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import path from 'path';

import apiRouter from './routes/api';

const app = express();
const port = process.env.PORT || 3001;

// various configs/use
const corsConfig: CorsOptions = {
  origin: [
    'http://localhost:3000',
    'https://www.playpickup.com',
    'https://p.pckp.io',
    'https://staging.playpickup.com',
    'https://s.pckp.io',
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsConfig));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// api routes
app.use('/v1', apiRouter);

// health check
app.get('/health', (req: Request, res: Response) => res.sendStatus(200));

app.listen(port, () => {
  console.log(`PickUp API listening on ${port}`);
});
