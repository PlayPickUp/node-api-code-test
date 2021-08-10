import express, { Request, Response } from 'express';
import { props } from '../controllers/props.controller';

const propsRouter = express.Router();

propsRouter.get('/', (req: Request, res: Response) => res.sendStatus(403));

propsRouter.get(
  '/props',
  async (req: Request, res: Response) => await props(req, res)
);

export default propsRouter;
