import { LoggingOptions } from '../exceptions/interfaces/exception.interface';
import LoggingStrategy from './logging-strategy';

class ConsoleLogger extends LoggingStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(error: Error, loggingOptions?: LoggingOptions): void {
    const format = loggingOptions?.logger?.options?.format;
    let errorStr = error.message;
    if (format) {
      this.validateFormat(format);
      errorStr = this.formatError(error, format);
    }
    console.error(errorStr);
  }
}

export default new ConsoleLogger();
