import httpStatus from 'http-status';
import R from 'ramda';
import { SQLDatabaseException } from './sql-database-exception';

export class UniqueViolationException extends SQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(private columns: string[]) {
    const errorObj: any = {
      fields: columns,
      code: 'DATA_ALREADY_EXIST',
      message: `${columns.join(', ')} already exist`,
    };
    if (R.isEmpty(columns)) {
      delete errorObj.fields;
      errorObj.message = `data already exist`;
    }
    super([errorObj]);
    Object.setPrototypeOf(this, UniqueViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
