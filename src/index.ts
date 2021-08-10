import cors, { CorsRequest } from 'cors';
import express, { Request, Response } from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import path from 'path';

import propsRouter from './routes/props.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.options('*', cors<CorsRequest>());

/*
Node / API Code Test: PickUp

Below you will find a simplified snippet of our API.

We have included the neccessary ENV variables and database connections for the API to function correctly. Using this
scaffold, return 4 MLB props (propositions) sorted by `fan_picks_count`. This repo is using typescript, so feel free to
incorporate typings as needed.

The endpoint you will be using is http://localhost:{PORT}/v1/props (port will most likely be 3001)
*/

// api routes
app.use('/v1', propsRouter);

// health check
app.get('/health', (req: Request, res: Response) => res.sendStatus(200));

app.listen(port, () => {
  console.log(`PickUp API listening on ${port}`);
});
