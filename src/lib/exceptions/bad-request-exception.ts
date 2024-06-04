import httpStatus from 'http-status';
import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';

export class BadRequestException extends BaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(public error: IException) {
    super(error.message);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}
