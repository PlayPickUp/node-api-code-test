import express, { Request, Response } from 'express';
import favicon from 'serve-favicon';
import path from 'path';

import apiRouter from './routes/api';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/api/v1', apiRouter);

app.get('/health', (req: Request, res: Response) => res.sendStatus(200));

app.listen(port, () => {
  console.log(`PickUp API listening on ${port}`);
});
