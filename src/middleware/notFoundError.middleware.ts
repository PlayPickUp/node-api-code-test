import {NextFunction, Request, Response} from 'express';

export const notFoundErrorHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const message =
    'Consider the requested resource a golf disc that went into a water hazard, because it is NOT FOUND.';

  response.status(404).send(message);
};
