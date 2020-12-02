import express, { Request, Response } from 'express';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import path from 'path';

import apiRouter from './routes/api';
import { checkClosingProps } from './crons/checkClosingProps';

const app = express();
const port = process.env.PORT || 3000;

// various configs/use
app.use(helmet());
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// crons
checkClosingProps.start();

// api routes
app.use('/api/v1', apiRouter);

// health check
app.get('/health', (req: Request, res: Response) => res.sendStatus(200));

app.listen(port, () => {
  console.log(`PickUp API listening on ${port}`);
});
