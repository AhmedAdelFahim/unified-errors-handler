/* eslint-disable @typescript-eslint/no-unused-vars */
import R from 'ramda';
import { InvalidDataException } from './invalid-data-exception';

const supportedErrors = {
  WARN_DATA_TRUNCATED: (error: any) => {
    return new InvalidDataException({
      code: 'INVALID_VALUES',
      message: `Invalid Values`,
    });
  },
  ER_WARN_DATA_OUT_OF_RANGE: (error: any) => {
    return new InvalidDataException({
      code: 'INVALID_VALUES',
      message: `Invalid Values`,
    });
  },
};
export function isMYSQLError(error: any) {
  return !R.isNil(error?.code) && !R.isNil(error?.errno);
}

export function parseMYSQLErrors(error: any) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return supportedErrors[error.code](error);
}
