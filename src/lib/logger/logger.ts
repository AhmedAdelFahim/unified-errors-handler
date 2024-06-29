import consoleLogger from './console-logger';
import fileLogger from './file-logger';
import { ILoggerOptions, LoggerTypes } from './logger.interface';

export default function log(error: any, loggingOptions: ILoggerOptions): void {
  const loggingTypes: any = Object.keys(loggingOptions);

  loggingTypes.forEach((type: LoggerTypes) => {
    if (type === 'console') {
      consoleLogger.log(error, loggingOptions[type]);
    } else if (type === 'custom') {
      if (typeof loggingOptions[type] === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        loggingOptions[type]?.(error);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        loggingOptions[type]?.log(error);
      }
    } else if (type === 'file') {
      fileLogger.log(error, loggingOptions[type]);
    }
  });
}
