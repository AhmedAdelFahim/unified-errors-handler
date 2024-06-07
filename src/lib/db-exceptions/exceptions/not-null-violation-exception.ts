import httpStatus from 'http-status';
import { SQLDatabaseException } from './sql-database-exception';

export class NotNullViolationException extends SQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(private column: string) {
    super([
      {
        fields: [column],
        code: 'INVALID_DATA',
        message: `${column} is invalid`,
        details: {
          reason: `${column} must not be NULL`,
        },
      },
    ]);
    Object.setPrototypeOf(this, NotNullViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
