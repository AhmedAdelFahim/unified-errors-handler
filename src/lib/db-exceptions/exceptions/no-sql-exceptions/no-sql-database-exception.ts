import { IException } from '../../../exceptions/interfaces/exception.interface';
import { DatabaseException } from '../database-exception';
import constants from '../../../utils/constants';

export class NoSQLDatabaseException extends DatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(protected error: IException[]) {
    super();
    Object.setPrototypeOf(this, NoSQLDatabaseException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
