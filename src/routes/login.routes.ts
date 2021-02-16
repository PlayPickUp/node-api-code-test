import express from 'express';
import passport from 'passport';

const loginRouter = express.Router();

loginRouter.post(
  '/login/publisher',
  passport.authenticate('publishertoken', { session: false }),
  function (req, res) {
    res.sendStatus(204);
  }
);

loginRouter.post(
  '/login/admin',
  passport.authenticate('admintoken', { session: false }),
  function (req, res) {
    res.sendStatus(204);
  }
);

export default loginRouter;
