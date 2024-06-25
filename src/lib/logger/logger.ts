import consoleLogger from './console-logger';
import { ILoggerOptions, LoggerTypes } from './logger.interface';

export default function log(error: any, loggingOptions: ILoggerOptions): void {
  const loggingTypes: any = Object.keys(loggingOptions);

  loggingTypes.forEach((type: LoggerTypes) => {
    if (type === 'console') {
      consoleLogger.log(error, loggingOptions[type]);
    } else if (type === 'custom') {
      loggingOptions[type]?.log(error);
    }
  });
}
