import httpStatus from 'http-status';
import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';

export class ValidationException extends BaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(public messages: IException[]) {
    super('Validation Errors');

    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  serializeErrors() {
    return this.messages;
  }
}
