import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';
import constants from '../utils/constants';

export class ValidationException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(public messages: IException[]) {
    super('Validation Errors');

    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  serializeErrors() {
    return this.messages;
  }
}
