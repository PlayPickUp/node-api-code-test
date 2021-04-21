import express, {Request, Response} from 'express';
import passport from 'passport';
import cors from 'cors';
import {publicCorsConfig} from '../util/corsOptions';
import {
    addPrizeCodes,
    createPrize,
    getPrizes,
    getRedemptionDates,
    redeemPrizeCode
} from "../controllers/prizes.controller";

const prizesRouter = express.Router();

prizesRouter.get(
    '/prizes',
    cors(publicCorsConfig),
    async (req: Request, res: Response) => await getPrizes(req, res)
);

prizesRouter.get(
    '/prizes/redemptiondates',
    cors(publicCorsConfig),
    passport.authenticate('publishertoken', {
        session: false,
    }),
    async (req: Request, res: Response) => await getRedemptionDates(req, res)
);

prizesRouter.post(
    '/prizes',
    cors(publicCorsConfig),
    passport.authenticate('admintoken', {
        session: false,
    }),
    async (req: Request, res: Response) => await createPrize(req, res)
);

prizesRouter.post(
    '/prizes/codes',
    cors(publicCorsConfig),
    passport.authenticate('admintoken', {
        session: false,
    }),
    async (req: Request, res: Response) => await addPrizeCodes(req, res)
);

prizesRouter.put(
    '/prizes/codes/',
    cors(publicCorsConfig),
    passport.authenticate('publishertoken', {
        session: false,
    }),
    async (req: Request, res: Response) => await redeemPrizeCode(req, res)
);


export default prizesRouter;
