import express, { Request, Response } from 'express';
import passport from 'passport';
import cors from 'cors';
import { publicCorsConfig } from '../util/corsOptions';
import { createEvent } from '../controllers/events.controller';

const eventsRouter = express.Router();

eventsRouter.post(
  '/events',
  cors(publicCorsConfig),
  passport.authenticate('eventstoken', {
    session: false,
  }),
  async (req: Request, res: Response) => await createEvent(req, res)
);

export default eventsRouter;
