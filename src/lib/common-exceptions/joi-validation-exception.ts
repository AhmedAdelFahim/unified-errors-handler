import { ValidationError, ValidationErrorItem } from 'joi';
import { ValidationException } from '../exceptions/validation-exception';
import { IException } from '../exceptions/interfaces/exception.interface';

export class JoiValidationException extends ValidationException {
  constructor(public errors: ValidationError) {
    super(
      errors.details.map((error: ValidationErrorItem): IException => {
        return {
          message: error.message,
        };
      }),
    );

    Object.setPrototypeOf(this, JoiValidationException.prototype);
  }
}
