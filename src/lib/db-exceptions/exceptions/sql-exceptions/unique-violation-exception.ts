import R from 'ramda';
import { SQLDatabaseException } from './sql-database-exception';
import constants from '../../../utils/constants';

export class UniqueViolationException extends SQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(private columns: string[]) {
    const errorObj: any = {
      fields: columns,
      code: constants.ERROR_CODES.DATA_ALREADY_EXIST,
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
