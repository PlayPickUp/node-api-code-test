import {NextFunction, Request, Response} from 'express';

export const forbiddenErrorHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const message = 'Out of bounds! This resource is forbidden';

  response.status(403).send(message);
};
