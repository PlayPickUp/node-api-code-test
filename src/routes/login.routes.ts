import express, { Request, Response } from 'express';
import passport from "passport";
const loginRouter = express.Router();

loginRouter.post('/login', passport.authenticate('publishertoken', {session: false, optional: true, }),
    function (req, res) {
    res.sendStatus(204)
    });

export default loginRouter;
