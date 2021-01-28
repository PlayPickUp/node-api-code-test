import express, { Request, Response } from 'express';
import { closingProps, props } from '../controllers/props-ctrl';
import { sendDemoRequest } from '../controllers/publisher-ctrl';

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.sendStatus(403));
router.get(
  '/props',
  async (req: Request, res: Response) => await props(req, res)
);
router.get(
  '/props/closing',
  async (req: Request, res: Response) => await closingProps(req, res)
);

router.post(
  '/publisher/demo',
  async (req: Request, res: Response) => await sendDemoRequest(req, res)
);

export default router;
