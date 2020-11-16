import express, { Request, Response } from 'express';
import props from '../controllers/props-ctrl';

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.sendStatus(403));
router.get('/props', (req: Request, res: Response) => props(req, res));

export default router;
