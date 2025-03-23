import { SQLDatabaseException } from './sql-database-exception';
import constants from '../../../utils/constants';

export class InvalidDataException extends SQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(private err?: any) {
    super([
      err || {
        code: constants.ERROR_CODES.INVALID_VALUES,
        message: `Invalid Values`,
      },
    ]);
    Object.setPrototypeOf(this, InvalidDataException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
