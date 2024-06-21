import { BaseException } from '../exceptions/base-exception';
import { ForeignKeyViolationException } from './exceptions/sql-exceptions/foreign-key-violation-exception';
import objectionDBExceptionParser from './objectionjs-parser';
import { lazyLoad } from '../utils/helper';

export function isSequelizeError(error: unknown) {
  const sequelize = lazyLoad('sequelize');
  return error instanceof sequelize.BaseError;
}

export default function sequelizeDBExceptionParser(err: any): BaseException | null {
  const sequelize = lazyLoad('sequelize');
  if (err instanceof sequelize.UniqueConstraintError) {
    return objectionDBExceptionParser(err.original);
  }

  if (err instanceof sequelize.ForeignKeyConstraintError) {
    const constraint = err?.index || '';
    return new ForeignKeyViolationException(constraint, err?.original);
  }
  if (err instanceof sequelize.DatabaseError) {
    return objectionDBExceptionParser(err.original);
  }

  return null;
}
