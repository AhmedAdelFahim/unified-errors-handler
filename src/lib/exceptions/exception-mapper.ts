import { DBError } from 'db-errors';
import { BaseException } from './base-exception';
import { IExceptionMapperOptions } from './interfaces/exception.interface';
import { ServerException } from './server-exception';
import sequelizeDBExceptionParser, { isSequelizeError } from '../db-exceptions/sequelize-parser';
import objectionDBExceptionParser from '../db-exceptions/objectionjs-parser';
import typeormDBExceptionParser, { isTypeORMError } from '../db-exceptions/typeorm-parser';
import mongoDBExceptionParser, { isMongoDBError, isMongooseDBError } from '../db-exceptions/mongodb-parser';
import log from '../logger/logger';

function dbExceptionMapper(error: unknown, options?: IExceptionMapperOptions): BaseException | null {
  if (options?.parseMongooseExceptions && (isMongoDBError(error) || isMongooseDBError(error))) {
    return mongoDBExceptionParser(error);
  } else if (options?.parseSequelizeExceptions && isSequelizeError(error)) {
    return sequelizeDBExceptionParser(error);
  } else if (options?.parseTypeORMExceptions && isTypeORMError(error)) {
    return typeormDBExceptionParser(error);
  } else if ((options?.parseObjectionJSExceptions && error instanceof DBError) || options?.parseKnexJSExceptions) {
    return objectionDBExceptionParser(error);
  } else if (
    options?.parseSequelizeExceptions ||
    options?.parseObjectionJSExceptions ||
    options?.parseTypeORMExceptions ||
    options?.parseKnexJSExceptions
  ) {
    return objectionDBExceptionParser(error);
  }
  return null;
}

export default function exceptionMapper(err: unknown, options?: IExceptionMapperOptions): BaseException {
  if (options?.loggerOptions) {
    log(err, options?.loggerOptions);
  }
  if (options?.mapDBExceptions) {
    throw new Error(
      `mapDBExceptions is deprecated.\n
      please use other options :\n
      \t - parseMongooseExceptions to parse mongoose errors.\n
      \t - parseSequelizeExceptions to parse Sequelize errors.\n
      \t - parseTypeORMExceptions to parse TypeORM errors.\n
      \t - parseObjectionJSExceptions to parse ObjectionJS errors.\n
      \t - parseKnexJSExceptions to parse KnexJS errors.\n
      For more info visit https://github.com/AhmedAdelFahim/unified-errors-handler`,
    );
  }
  const mappedError = dbExceptionMapper(err, options);
  if (mappedError) {
    return mappedError;
  }
  if (err instanceof BaseException) {
    return err;
  }
  return new ServerException();
}
