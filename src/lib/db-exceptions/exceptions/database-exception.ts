import { BaseException } from '../../exceptions/base-exception';
import constants from '../../utils/constants';

export abstract class DatabaseException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor() {
    super('Error: DatabaseException');
    Object.setPrototypeOf(this, DatabaseException.prototype);
  }
}
