import { BaseException } from './base-exception';
import { IException } from './interfaces/exception.interface';
import constants from '../utils/constants';

export class NotFoundException extends BaseException {
  statusCode = constants.HTTP_STATUS_CODES.NOT_FOUND;

  constructor(
    public messages: IException | IException[] = { message: 'Not Found', code: constants.ERROR_CODES.NOT_FOUND },
  ) {
    super('Not Found');

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }

  serializeErrors() {
    return Array.isArray(this.messages) ? this.messages : [this.messages];
  }
}
