import httpStatus from 'http-status';
import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';

export class ForbiddenException extends BaseException {
  statusCode = httpStatus.FORBIDDEN;

  constructor(public error: IException) {
    super('Forbidden');

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}
