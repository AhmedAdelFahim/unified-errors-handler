import { BaseException } from './base-exception';
import exceptionMapper from './exception-mapper';
import { IExceptionMapperOptions } from './interfaces/exception.interface';

export default function expressExceptionHandler(options?: IExceptionMapperOptions) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: Error, req: any, res: any, next: any) => {
    const mappedError = exceptionMapper(err, options);
    if (err instanceof BaseException) {
      return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    res.status(mappedError.statusCode).send({
      errors: mappedError.serializeErrors(),
    });
  };
}
