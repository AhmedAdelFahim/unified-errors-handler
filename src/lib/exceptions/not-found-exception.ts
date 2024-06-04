import httpStatus from 'http-status';
import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';

export class NotFoundException extends BaseException {
  statusCode = httpStatus.NOT_FOUND;

  constructor(public messages: IException[]) {
    super('Not Found');

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }

  serializeErrors() {
    return this.messages;
  }
}
