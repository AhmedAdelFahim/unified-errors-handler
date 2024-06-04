import { IException } from './interfaces/exception.interface';

export abstract class BaseException extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseException.prototype);
  }

  abstract serializeErrors(): IException[];
}
