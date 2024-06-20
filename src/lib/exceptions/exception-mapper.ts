import { DBError } from 'db-errors';
import { BaseException } from './base-exception';
import { IExceptionMapperOptions } from './interfaces/exception.interface';
import { ServerException } from './server-exception';
import { BaseError } from 'sequelize';
import sequelizeDBExceptionMapper from '../db-exceptions/sequelize-mapper';
import objectionDBExceptionMapper from '../db-exceptions/objectionjs-mapper';
import typeormDBExceptionMapper from '../db-exceptions/typeorm-mapper';
import { TypeORMError } from 'typeorm';
import mongoDBExceptionParser, { isMongoDBError, isMongooseDBError } from '../db-exceptions/mongodb-parser';
function dbExceptionMapper(error: unknown): BaseException | null {
  if (isMongoDBError(error) || isMongooseDBError(error)) {
    return mongoDBExceptionParser(error);
  } else if (error instanceof BaseError) {
    return sequelizeDBExceptionMapper(error);
  } else if (error instanceof TypeORMError) {
    return typeormDBExceptionMapper(error);
  } else if (error instanceof DBError) {
    return objectionDBExceptionMapper(error);
  } else {
    return objectionDBExceptionMapper(error);
  }
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
