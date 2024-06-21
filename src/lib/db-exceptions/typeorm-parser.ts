import { BaseException } from '../exceptions/base-exception';
import objectionDBExceptionParser from './objectionjs-parser';
import { lazyLoad } from '../utils/helper';

export function isTypeORMError(error: unknown) {
  const typeorm = lazyLoad('typeorm');
  return error instanceof typeorm.TypeORMError;
}

export default function typeormDBExceptionParser(error: any): BaseException | null {
  const typeorm = lazyLoad('typeorm');
  if (error instanceof typeorm.QueryFailedError) {
    return objectionDBExceptionParser(error.driverError);
  }
  return null;
}
