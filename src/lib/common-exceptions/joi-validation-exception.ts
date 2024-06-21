import { ValidationException } from '../exceptions/validation-exception';
import { IException } from '../exceptions/interfaces/exception.interface';

export class JoiValidationException extends ValidationException {
  constructor(public errors: any) {
    super(
      errors.details.map((error: any): IException => {
        return {
          message: error.message,
        };
      }),
    );

    Object.setPrototypeOf(this, JoiValidationException.prototype);
  }
}
