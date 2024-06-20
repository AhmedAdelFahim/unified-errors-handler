import httpStatus from 'http-status';
import { SQLDatabaseException } from './sql-database-exception';

export class OutOfRangeViolationException extends SQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor() {
    const errorObj: any = {
      code: 'OUT_OF_RANGE',
      message: `Out of range`,
    };

    super([errorObj]);
    Object.setPrototypeOf(this, OutOfRangeViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
