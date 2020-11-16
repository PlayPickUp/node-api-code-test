import express, { Request, Response } from 'express';
import apiRouter from './routes/api';

const app = express();
const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello World! - ${NODE_ENV}`);
});

app.use('/api/v1', apiRouter);

app.get('/health', (req: Request, res: Response) => res.sendStatus(200));

app.listen(port, () => {
  console.log(`PickUp API listening on ${port}`);
});
