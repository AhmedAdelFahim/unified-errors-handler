import {
  CheckViolationError,
  DataError,
  ForeignKeyViolationError,
  NotNullViolationError,
  UniqueViolationError,
  wrapError,
} from 'db-errors';
import { BaseException } from '../exceptions/base-exception';
import { UniqueViolationException } from './exceptions/sql-exceptions/unique-violation-exception';
import { ForeignKeyViolationException } from './exceptions/sql-exceptions/foreign-key-violation-exception';
import { NotNullViolationException } from './exceptions/sql-exceptions/not-null-violation-exception';
import { CheckViolationException } from './exceptions/sql-exceptions/check-violation-exception';
import { InvalidDataException } from './exceptions/sql-exceptions/invalid-data-exception';
import { isSQLError, parseSQLErrors } from './exceptions/parser';

export default function objectionDBExceptionParser(error: unknown): BaseException | null {
  const err = wrapError(error as Error);
  if (err instanceof UniqueViolationError) {
    const columns = err?.columns || [];
    return new UniqueViolationException(columns);
  }

  if (err instanceof NotNullViolationError) {
    return new NotNullViolationException(err.column);
  }
  if (err instanceof ForeignKeyViolationError) {
    return new ForeignKeyViolationException(err.constraint, err.nativeError);
  }

  if (err instanceof CheckViolationError) {
    return new CheckViolationException(err.constraint);
  }

  if (isSQLError(err)) {
    return parseSQLErrors(err);
  }

  if (err instanceof DataError) {
    return new InvalidDataException();
  }

  return null;
}
