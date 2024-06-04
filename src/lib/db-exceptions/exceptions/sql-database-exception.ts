import httpStatus from 'http-status';
import { IException } from '../../exceptions/interfaces/exception.interface';
import { BaseException } from '../../exceptions/base-exception';

export class SQLDatabaseException extends BaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(public error: IException[]) {
    super('Error: SQLDatabaseException');
    Object.setPrototypeOf(this, SQLDatabaseException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
