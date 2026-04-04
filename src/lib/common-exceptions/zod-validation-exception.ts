import { ValidationException } from '../exceptions/validation-exception';
import { IException } from '../exceptions/interfaces/exception.interface';

export class ZodValidationException extends ValidationException {
  constructor(public error: any) {
    super(
      error.issues.map((issue: any): IException => {
        const item: IException = {
          message: issue.message,
        };
        if (issue.path != null && Array.isArray(issue.path) && issue.path.length > 0) {
          item.fields = issue.path.map((segment: PropertyKey) => String(segment));
        }
        if (issue.code != null) {
          item.code = String(issue.code);
        }
        return item;
      }),
    );

    Object.setPrototypeOf(this, ZodValidationException.prototype);
  }
}
