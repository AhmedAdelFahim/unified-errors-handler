import httpStatus from 'http-status';
import { IException } from '../../../exceptions/interfaces/exception.interface';
import { DatabaseException } from '../database-exception';

export class NoSQLDatabaseException extends DatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(protected error: IException[]) {
    super();
    Object.setPrototypeOf(this, NoSQLDatabaseException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
