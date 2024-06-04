import httpStatus from 'http-status';
import { SQLDatabaseException } from './sql-database-exception';

export class UniqueViolationException extends SQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(public columns: string[]) {
    super([
      {
        fields: columns,
        code: 'DATA_ALREADY_EXIST',
        message: `${columns.join(', ')} already exist`,
      },
    ]);
    Object.setPrototypeOf(this, UniqueViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
