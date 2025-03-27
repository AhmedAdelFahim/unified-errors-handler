import constants from '../utils/constants';
import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';

export class ServerException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

  constructor(
    public error: IException = { message: 'Internal Server Error', code: constants.ERROR_CODES.INTERNAL_SERVER_ERROR },
  ) {
    super(error.message);

    Object.setPrototypeOf(this, ServerException.prototype);
  }

  serializeErrors() {
    return [{ ...this.error }];
  }
}
