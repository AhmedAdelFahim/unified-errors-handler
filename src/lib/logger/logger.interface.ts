export type ConsoleLoggerOptions = {
  format?: string;
  colored?: boolean;
  // color?: 'red' | 'green' | 'blue';
};

export interface ILoggerOptions {
  console?: ConsoleLoggerOptions;
  custom?: ILogger;
}

export type LoggerTypes = 'console' | 'custom';

export default interface ILogger {
  log(error: any, loggingOptions?: ConsoleLoggerOptions): void;
}
