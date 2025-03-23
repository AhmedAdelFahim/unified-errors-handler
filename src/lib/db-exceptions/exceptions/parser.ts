/* eslint-disable @typescript-eslint/no-unused-vars */
import constants from '../../utils/constants';
import { InvalidDataException } from './sql-exceptions/invalid-data-exception';
import { OutOfRangeViolationException } from './sql-exceptions/out-of-range-violation-exception';

const supportedErrors = {
  WARN_DATA_TRUNCATED: (error: any) => {
    return new InvalidDataException({
      code: constants.ERROR_CODES.INVALID_VALUES,
      message: `Invalid Values`,
    });
  },
  ER_WARN_DATA_OUT_OF_RANGE: (error: any) => {
    return new OutOfRangeViolationException();
  },
  // postgres errors
  // out of range error
  22003: (error: any) => {
    return new OutOfRangeViolationException();
  },
};
export function isSQLError(error: any) {
  return (
    Object.keys(supportedErrors).includes(error?.code) ||
    Object.keys(supportedErrors).includes(error?.nativeError?.code)
  );
}

export function parseSQLErrors(error: any) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (supportedErrors?.[error?.code]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return supportedErrors?.[error?.code](error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } else if (supportedErrors?.[error?.nativeError?.code]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return supportedErrors?.[error?.nativeError?.code](error);
  }
  return null;
}
