import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';
import constants from '../utils/constants';

export class ForbiddenException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.FORBIDDEN;

  constructor(public error: IException) {
    super('Forbidden');

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}
