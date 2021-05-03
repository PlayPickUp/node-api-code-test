import express, { Request, Response } from 'express';
import {
  sendDemoRequest,
  deletePost,
} from '../controllers/publisher.controller';
import { publicCorsConfig } from '../util/corsOptions';
import cors from 'cors';
import { authenticate } from 'passport';

const publishersRouter = express.Router();

publishersRouter.post(
  '/publisher/demo',
  cors(publicCorsConfig),
  async (req: Request, res: Response) => await sendDemoRequest(req, res)
);

publishersRouter.delete(
  '/publisher/posts',
  cors(publicCorsConfig),
  authenticate('publishertoken', { session: false }),
  async (req: Request, res: Response) => await deletePost(req, res)
);

export default publishersRouter;
