import httpStatus from 'http-status';
import R from 'ramda';
import { NoSQLDatabaseException } from './no-sql-database-exception';

export class MongoDBUniqueViolationException extends NoSQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(private columns: string[], private values: unknown[]) {
    const errorObj: any = {
      fields: columns,
      values,
      code: 'DATA_ALREADY_EXIST',
      message: `${columns.join(', ')} already exist`,
    };
    if (R.isEmpty(columns)) {
      delete errorObj.fields;
      errorObj.message = `data already exist`;
    }
    super([errorObj]);
    Object.setPrototypeOf(this, MongoDBUniqueViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
