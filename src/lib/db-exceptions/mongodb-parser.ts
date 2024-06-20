import mongoose from 'mongoose';
import { BaseException } from '../exceptions/base-exception';
import { MongoDBUniqueViolationException } from './exceptions/no-sql-exceptions/mongodb-unique-violation-exception';
import { IException } from '../exceptions/interfaces/exception.interface';
import { MongooseValidationException } from './exceptions/no-sql-exceptions/mongoose-validation-exception';

export function isMongoDBError(error: any) {
  return typeof error === 'object' && error?.constructor?.name === 'MongoServerError';
}

export function isMongooseDBError(error: any) {
  return error instanceof mongoose.MongooseError;
}

export default function mongoDBExceptionParser(error: any): BaseException | null {
  if (error?.code == 11000) {
    const errorResponse = error?.errorResponse || {};
    const keyValue = errorResponse?.keyValue || {};
    const columns = Object.keys(keyValue);
    const values = Object.values(keyValue);
    return new MongoDBUniqueViolationException(columns, values);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const { errors } = error;
    const fields = Object.keys(error.errors);
    const mappedErrors = fields.map((key: string): IException => {
      const fields = [key];
      const err = errors[key];
      const mappedError: IException = {
        fields,
        message: 'mongoDB validation error',
        code: 'MONGODB_VALIDATION_ERROR',
      };
      if (err instanceof mongoose.Error.ValidatorError) {
        mappedError.message = err.message;
        if (err.kind === 'required') {
          mappedError.details = {
            ...(mappedError?.details || {}),
            reason: `${key} is required`,
            violate: `${err.kind}_validation`,
          };
        } else if (err.kind === 'enum') {
          mappedError.details = {
            ...(mappedError?.details || {}),
            violate: `${err.kind}_validation`,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reason: `${key}'s value must be one of ${(err?.properties?.enumValues || []).join(', ')}`,
          };
        } else if (err.kind === 'max') {
          mappedError.details = {
            ...(mappedError?.details || {}),
            violate: `${err.kind}_validation`,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reason: `${key}'s value exceed maximum allowed value (${err.properties.max})`,
          };
        } else if (err.kind === 'min') {
          mappedError.details = {
            ...(mappedError?.details || {}),
            violate: `${err.kind}_validation`,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reason: `${key}'s value less than minimum allowed value (${err.properties.min})`,
          };
        }
      } else if (err instanceof mongoose.Error.CastError) {
        mappedError.message = `${key} is invalid`;
        mappedError.code = 'MONGODB_CASTING_ERROR';
      }
      return mappedError;
    });
    return new MongooseValidationException(mappedErrors);
  }

  return null;
}
