import chalk from 'chalk';
import loggerFormatter from './logger-formatter';
import ILogger, { ConsoleLoggerOptions } from './logger.interface';

class ConsoleLogger implements ILogger {
  log(error: Error, loggingOptions?: ConsoleLoggerOptions): void {
    const format = loggingOptions?.format;
    let errorStr = error.message;
    if (format) {
      loggerFormatter.validateFormat(format);
      errorStr = loggerFormatter.formatError(error, format);
    }
    if (loggingOptions?.colored) {
      console.error(chalk.red(errorStr));
    } else {
      console.error(errorStr);
    }
  }
}

export default new ConsoleLogger();
