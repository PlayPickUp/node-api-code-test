import express, { Request, Response } from 'express';
import { closingProps, props } from '../controllers/props.controller';
import { sendDemoRequest } from '../controllers/publisher.controller';

const publishersRouter = express.Router();

publishersRouter.post(
  '/publisher/demo',
  async (req: Request, res: Response) => await sendDemoRequest(req, res)
);

export default publishersRouter;
