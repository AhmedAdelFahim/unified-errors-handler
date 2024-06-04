import { DBError } from 'db-errors';
import { BaseException } from './base-exception';
import { IExceptionMapperOptions } from './interfaces/exception.interface';
import { ServerException } from './server-exception';
import { BaseError } from 'sequelize';
import sequelizeDBExceptionMapper from '../db-exceptions/sequelize-mapper';
import objectionDBExceptionMapper from '../db-exceptions/objectionjs-mapper';
function dbExceptionMapper(error: unknown): BaseException | null {
  if (error instanceof BaseError) {
    return sequelizeDBExceptionMapper(error);
  }
  if (error instanceof DBError) {
    return objectionDBExceptionMapper(error);
  }
  return null;
}

export default function exceptionMapper(err: unknown, options?: IExceptionMapperOptions): BaseException {
  let mappedError;
  if (options?.mapDBExceptions) {
    mappedError = dbExceptionMapper(err);
  }
  if (mappedError) {
    return mappedError;
  }
  if (err instanceof BaseException) {
    return err;
  }
  return new ServerException();
}
