import { SQLDatabaseException } from './sql-database-exception';
import constants from '../../../utils/constants';

export class CheckViolationException extends SQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(private constraint: string) {
    const errorObj: any = {
      code: constants.ERROR_CODES.INVALID_VALUES,
      message: `Invalid Values`,
      details: {
        constraint,
      },
    };

    super([errorObj]);
    Object.setPrototypeOf(this, CheckViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
