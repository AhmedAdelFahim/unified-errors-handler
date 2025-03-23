import { IException } from '../../../exceptions/interfaces/exception.interface';
import constants from '../../../utils/constants';
import { DatabaseException } from '../database-exception';

export abstract class SQLDatabaseException extends DatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(protected error: IException[]) {
    super();
    Object.setPrototypeOf(this, SQLDatabaseException.prototype);
  }
}
