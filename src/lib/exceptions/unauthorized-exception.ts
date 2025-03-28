import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';
import constants from '../utils/constants';

export class UnauthorizedException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.UNAUTHORIZED;

  constructor(public error: IException = { message: 'Unauthorized', code: constants.ERROR_CODES.UNAUTHORIZED }) {
    super(error.message);

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }

  serializeErrors() {
    return [this.error];
  }
}
