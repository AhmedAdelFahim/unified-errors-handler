import { BaseException } from '../exceptions/base-exception';
import { QueryFailedError } from 'typeorm';
import objectionDBExceptionMapper from './objectionjs-mapper';

export default function typeormDBExceptionMapper(error: unknown): BaseException | null {
  if (error instanceof QueryFailedError) {
    return objectionDBExceptionMapper(error.driverError);
  }
  return null;
}
