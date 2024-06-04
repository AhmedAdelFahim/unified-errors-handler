import httpStatus from 'http-status';
import { SQLDatabaseException } from './sql-database-exception';

function extractDetails(constraint: string, nativeError: any) {
  const notExistInAnotherTableReg = new RegExp(/^Key \(.+\)=\(.+\) is not present in table ".+"\.$/);
  const stillReferencedInAnotherTableReg = new RegExp(/Key \(.+\)=\(.+\) is still referenced from table ".+"\./);
  if (notExistInAnotherTableReg.test(nativeError?.detail)) {
    return [
      {
        code: 'INVALID_DATA',
        message: `Invalid data`,
        details: {
          reason: 'violates foreign key constraint',
          constraint: constraint,
        },
      },
    ];
  } else if (stillReferencedInAnotherTableReg.test(nativeError?.detail)) {
    return [
      {
        code: 'DATA_HAS_REFERENCE',
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
        code: 'INVALID_DATA',
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
  statusCode = httpStatus.BAD_REQUEST;

  constructor(public constraint: string, public nativeError?: any) {
    super(extractDetails(constraint, nativeError));
    Object.setPrototypeOf(this, ForeignKeyViolationException.prototype);
  }

  serializeErrors() {
    return this.error;
  }
}
