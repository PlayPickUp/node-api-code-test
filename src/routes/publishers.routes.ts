import express, { Request, Response } from 'express';
import { sendDemoRequest } from '../controllers/publisher.controller';
import { publicCorsConfig } from '../util/corsOptions';
import cors from 'cors';

const publishersRouter = express.Router();

publishersRouter.post(
  '/publisher/demo',
  cors(publicCorsConfig),
  async (req: Request, res: Response) => await sendDemoRequest(req, res)
);

export default publishersRouter;
