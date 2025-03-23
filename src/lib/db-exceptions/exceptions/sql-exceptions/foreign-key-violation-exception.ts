import { SQLDatabaseException } from './sql-database-exception';
import constants from '../../../utils/constants';

function isReferenceError(nativeError: any) {
  const stillReferencedInAnotherTableReg = new RegExp(/Key \(.+\)=\(.+\) is still referenced from table ".+"\./);
  return stillReferencedInAnotherTableReg.test(nativeError?.detail) || nativeError?.errno == 1451;
}

function isHasNoReferenceError(nativeError: any) {
  const notExistInAnotherTableReg = new RegExp(/^Key \(.+\)=\(.+\) is not present in table ".+"\.$/);
  return notExistInAnotherTableReg.test(nativeError?.detail) || nativeError?.errno == 1452;
}

function extractDetails(constraint: string, nativeError: any) {
  if (isHasNoReferenceError(nativeError)) {
    return [
      {
        code: constants.ERROR_CODES.INVALID_DATA,
        message: `Invalid data`,
        details: {
          reason: 'violates foreign key constraint',
          constraint: constraint,
        },
      },
    ];
  } else if (isReferenceError(nativeError)) {
    return [
      {
        code: constants.ERROR_CODES.DATA_HAS_REFERENCE,
        message: `Data has reference`,
        details: {
          reason: 'violates foreign key constraint',
          constraint: constraint,
        },
      },
    ];
  } else {
    return [
      {
        code: constants.ERROR_CODES.INVALID_DATA,
        message: `Invalid data`,
        details: {
          reason: 'violates foreign key constraint',
          constraint: constraint,
        },
      },
    ];
  }
}

export class ForeignKeyViolationException extends SQLDatabaseException {
  statusCode = constants.HTTP_STATUS_CODES.BAD_REQUEST;

  constructor(private constraint: string, private nativeError?: any) {
    super(extractDetails(constraint, nativeError));
    Object.setPrototypeOf(this, ForeignKeyViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
