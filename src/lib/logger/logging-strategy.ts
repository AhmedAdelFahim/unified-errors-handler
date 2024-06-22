import { LoggingOptions } from '../exceptions/interfaces/exception.interface';

export default abstract class LoggingStrategy {
  protected formatRegex = {
    time: /^:time(\{\{\.\}\})?$/,
    message: /^:message$/,
  };
  abstract log(error: any, loggingOptions?: LoggingOptions): void;

  validateFormat(format: string) {
    const parts = format.split(' ');

    const validParts = Object.values(this.formatRegex);
    parts.forEach((part) => {
      let isValid = false;
      validParts.forEach((reg) => {
        if (reg.test(part)) {
          isValid = true;
          return;
        }
      });
      if (!isValid) {
        throw new Error('Invalid Logging Format');
      }
    });
  }

  formatError(error: Error, format: string) {
    const message = error.message;
    const parts = format.split(' ');
    const formattedError = parts.map((part) => {
      if (this.formatRegex.time.test(part)) {
        let defaultTimeFormat = 'YYYY-MM-DDTHH:mm:ss.sss';
        const customTimeFormat = part.replace(':time', '').replace(/\{\{/, '').replace(/\}\}/, '');
        if (customTimeFormat.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          defaultTimeFormat = customTimeFormat;
        }
        const now = new Date().toUTCString();
        return now;
      } else if (this.formatRegex.message.test(part)) {
        return message;
      }
    });
    return formattedError.join(' - ');
  }
}
