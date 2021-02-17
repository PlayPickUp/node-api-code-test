import express, {Request, Response} from 'express';
import {sendDemoRequest} from '../controllers/publisher.controller';

const publishersRouter = express.Router();

publishersRouter.post(
  '/publisher/demo',
  async (req: Request, res: Response) => await sendDemoRequest(req, res)
);

export default publishersRouter;
