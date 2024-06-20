import httpStatus from 'http-status';
import { BaseException } from '../../exceptions/base-exception';

export abstract class DatabaseException extends BaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor() {
    super('Error: DatabaseException');
    Object.setPrototypeOf(this, DatabaseException.prototype);
  }
}
