import httpStatus from 'http-status';
import { SQLDatabaseException } from './sql-database-exception';

export class InvalidDataException extends SQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(private err?: any) {
    super([
      err || {
        code: 'INVALID_VALUES',
        message: `Invalid Values`,
      },
    ]);
    Object.setPrototypeOf(this, InvalidDataException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
