import { SQLDatabaseException } from './sql-database-exception';
import constants from '../../../utils/constants';

export class NotNullViolationException extends SQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(private column: string) {
    super([
      {
        fields: [column],
        code: constants.ERROR_CODES.INVALID_DATA,
        message: `${column} is invalid`,
        details: {
          reason: `${column} must not be NULL`,
        },
      },
    ]);
    Object.setPrototypeOf(this, NotNullViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
