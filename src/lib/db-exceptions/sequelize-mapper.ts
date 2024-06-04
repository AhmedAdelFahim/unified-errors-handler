import { UniqueConstraintError, DatabaseError, ForeignKeyConstraintError } from 'sequelize';
import { BaseException } from '../exceptions/base-exception';
import { UniqueViolationException } from './exceptions/unique-violation-exception';
import { ForeignKeyViolationException } from './exceptions/foreign-key-violation-exception';
import objectionDBExceptionMapper from './objectionjs-mapper';

export default function sequelizeDBExceptionMapper(err: unknown): BaseException | null {
  // console.log(err);
  if (err instanceof UniqueConstraintError) {
    const columns = Object.keys(err.fields);
    return new UniqueViolationException(columns);
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
