import R from 'ramda';
import { NoSQLDatabaseException } from './no-sql-database-exception';
import constants from '../../../utils/constants';

export class MongoDBUniqueViolationException extends NoSQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(private columns: string[], private values: unknown[]) {
    const errorObj: any = {
      fields: columns,
      values,
      code: constants.ERROR_CODES.DATA_ALREADY_EXIST,
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
