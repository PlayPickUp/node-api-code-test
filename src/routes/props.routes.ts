import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { closingProps, props } from '../controllers/props.controller';
import { publicCorsConfig } from '../util/corsOptions';

const propsRouter = express.Router();

propsRouter.all(
  '*',
  cors(publicCorsConfig),
  (req: Request, res: Response, next: NextFunction) => next()
);

propsRouter.get('/', (req: Request, res: Response) => res.sendStatus(403));

propsRouter.get(
  '/props',
  async (req: Request, res: Response) => await props(req, res)
);

propsRouter.get(
  '/props/closing',
  async (req: Request, res: Response) => await closingProps(req, res)
);

export default propsRouter;
