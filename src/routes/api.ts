import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.sendStatus(403));

export default router;
