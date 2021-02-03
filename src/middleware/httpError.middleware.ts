import HttpException from '../exceptions/http-exception';
import { NextFunction, Request, Response } from 'express';

export const httpErrorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message =
    error.message || 'Flag on the play! Something went wrong on our end.';
  response.status(statusCode).send(message);
};
