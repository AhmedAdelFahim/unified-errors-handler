import { BaseException } from './base-exception';
import { Request, Response, NextFunction } from 'express';
import exceptionMapper from './exception-mapper';
import { IExceptionMapperOptions } from './interfaces/exception.interface';

export default function expressExceptionHandler(options?: IExceptionMapperOptions) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const mappedError = exceptionMapper(err, options);
    if (err instanceof BaseException) {
      return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    res.status(mappedError.statusCode).send({
      errors: mappedError.serializeErrors(),
    });
  };
}
