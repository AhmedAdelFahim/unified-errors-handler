import httpStatus from 'http-status';
import { IException } from '../../../exceptions/interfaces/exception.interface';
import { DatabaseException } from '../database-exception';

export abstract class SQLDatabaseException extends DatabaseException {
  statusCode = httpStatus.BAD_REQUEST;

  constructor(protected error: IException[]) {
    super();
    Object.setPrototypeOf(this, SQLDatabaseException.prototype);
  }
}
