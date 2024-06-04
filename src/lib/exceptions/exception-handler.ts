import { BaseException } from './base-exception';
import { Request, Response, NextFunction } from 'express';
import exceptionMapper from './exception-mapper';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function exceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const mappedError = exceptionMapper(err);
  if (err instanceof BaseException) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(mappedError.statusCode).send({
    errors: mappedError.serializeErrors(),
  });
}
