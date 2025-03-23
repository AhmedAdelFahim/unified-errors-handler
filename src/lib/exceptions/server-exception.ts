import constants from '../utils/constants';
import { BaseException } from './base-exception';

export class ServerException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

  constructor() {
    super('Internal Server Error');

    Object.setPrototypeOf(this, ServerException.prototype);
  }

  serializeErrors() {
    return [{ message: 'Internal Server Error' }];
  }
}
