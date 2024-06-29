export type ConsoleLoggerOptions = {
  format?: string;
  colored?: boolean;
  // color?: 'red' | 'green' | 'blue';
};

export type FileLoggerOptions = {
  format?: string;
  fileName?: string;
  maxFileSize?: string;
  path?: string;
};

export interface ILoggerOptions {
  console?: ConsoleLoggerOptions;
  file?: FileLoggerOptions;
  custom?: ILogger | ((error: any) => void);
}

export type LoggerTypes = 'console' | 'custom' | 'file';

export default interface ILogger {
  log(error: any, loggingOptions?: ConsoleLoggerOptions | FileLoggerOptions): void;
}
