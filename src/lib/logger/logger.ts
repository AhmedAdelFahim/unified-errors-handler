import { LoggingOptions } from '../exceptions/interfaces/exception.interface';
import consoleLogger from './console-logger';

export default function log(error: any, loggingOptions?: LoggingOptions): void {
  if (loggingOptions?.logger?.type === 'console') {
    consoleLogger.log(error, loggingOptions);
  }
}
