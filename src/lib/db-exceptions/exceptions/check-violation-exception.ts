import httpStatus from 'http-status';
import { SQLDatabaseException } from './sql-database-exception';

export class CheckViolationException extends SQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(private constraint: string) {
    const errorObj: any = {
      code: 'INVALID_VALUES',
      message: `Invalid Values`,
      details: {
        constraint,
      },
    };

    super([errorObj]);
    Object.setPrototypeOf(this, CheckViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
