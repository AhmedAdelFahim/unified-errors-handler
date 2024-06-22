export interface IException {
  message: string;
  code?: string;
  fields?: string[];
  details?: { [key: string]: any };
}

type ConsoleLoggerOptions = {
  format?: string;
};

type LoggerTypes = { type: 'console'; options?: ConsoleLoggerOptions };

export interface LoggingOptions {
  logger?: LoggerTypes;
}
export interface IExceptionMapperOptions {
  mapDBExceptions?: boolean;
  parseSequelizeExceptions?: boolean;
  parseMongooseExceptions?: boolean;
  parseTypeORMExceptions?: boolean;
  parseObjectionJSExceptions?: boolean;
  parseKnexJSExceptions?: boolean;
  logging?: LoggingOptions;
}
