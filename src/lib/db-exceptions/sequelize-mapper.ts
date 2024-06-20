import { UniqueConstraintError, DatabaseError, ForeignKeyConstraintError } from 'sequelize';
import { BaseException } from '../exceptions/base-exception';
import { ForeignKeyViolationException } from './exceptions/sql-exceptions/foreign-key-violation-exception';
import objectionDBExceptionMapper from './objectionjs-mapper';

export default function sequelizeDBExceptionMapper(err: unknown): BaseException | null {
  if (err instanceof UniqueConstraintError) {
    return objectionDBExceptionMapper(err.original);
  }

  if (err instanceof ForeignKeyConstraintError) {
    const constraint = err?.index || '';
    return new ForeignKeyViolationException(constraint, err?.original);
  }
  if (err instanceof DatabaseError) {
    return objectionDBExceptionMapper(err.original);
  }

  return null;
}
