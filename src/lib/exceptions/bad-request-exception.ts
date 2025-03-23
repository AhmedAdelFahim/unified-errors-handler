import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';
import constants from '../utils/constants';

export class BadRequestException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(public error: IException = { message: 'Bad request' }) {
    super(error.message);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}
