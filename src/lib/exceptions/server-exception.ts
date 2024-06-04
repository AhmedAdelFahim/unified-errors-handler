import httpStatus from 'http-status';
import { BaseException } from './base-exception';

export class ServerException extends BaseException {
  statusCode = httpStatus.INTERNAL_SERVER_ERROR;

  constructor() {
    super('Internal Server Error');

    Object.setPrototypeOf(this, ServerException.prototype);
  }

  serializeErrors() {
    return [{ message: 'Internal Server Error' }];
  }
}
