import { SQLDatabaseException } from './sql-database-exception';
import constants from '../../../utils/constants';

export class OutOfRangeViolationException extends SQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor() {
    const errorObj: any = {
      code: constants.ERROR_CODES.OUT_OF_RANGE,
      message: `Out of range`,
    };

    super([errorObj]);
    Object.setPrototypeOf(this, OutOfRangeViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
