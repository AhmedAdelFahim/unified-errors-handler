import { NoSQLDatabaseException } from './no-sql-database-exception';
import { IException } from '../../../exceptions/interfaces/exception.interface';
import constants from '../../../utils/constants';

export class MongooseValidationException extends NoSQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(private errors: IException[]) {
    super(errors);
    Object.setPrototypeOf(this, MongooseValidationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
