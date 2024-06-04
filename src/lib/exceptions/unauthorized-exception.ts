import httpStatus from 'http-status';
import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';

export class UnauthorizedException extends BaseException {
  statusCode = httpStatus.UNAUTHORIZED;

  constructor(public error: IException) {
    super('Unauthorized');

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}
