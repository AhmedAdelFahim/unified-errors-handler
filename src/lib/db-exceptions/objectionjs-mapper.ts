import { ForeignKeyViolationError, NotNullViolationError, UniqueViolationError, wrapError } from 'db-errors';
import { BaseException } from '../exceptions/base-exception';
import { UniqueViolationException } from './exceptions/unique-violation-exception';
import { ForeignKeyViolationException } from './exceptions/foreign-key-violation-exception';
import { NotNullViolationException } from './exceptions/not-null-violation-exception';

export default function objectionDBExceptionMapper(error: unknown): BaseException | null {
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
  return null;
}
