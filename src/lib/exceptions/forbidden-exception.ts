import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';
import constants from '../utils/constants';

export class ForbiddenException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.FORBIDDEN;

  constructor(public error: IException = { code: constants.ERROR_CODES.FORBIDDEN, message: 'Forbidden' }) {
    super(error.message);

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}
