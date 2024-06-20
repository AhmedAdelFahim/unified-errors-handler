import httpStatus from 'http-status';
import { NoSQLDatabaseException } from './no-sql-database-exception';
import { IException } from '../../../exceptions/interfaces/exception.interface';

export class MongooseValidationException extends NoSQLDatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(private errors: IException[]) {
    super(errors);
    Object.setPrototypeOf(this, MongooseValidationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
