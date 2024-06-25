import { ILoggerOptions } from '../../logger/logger.interface';

export interface IException {
  message: string;
  code?: string;
  fields?: string[];
  details?: { [key: string]: any };
}

export interface IExceptionMapperOptions {
  mapDBExceptions?: boolean;
  parseSequelizeExceptions?: boolean;
  parseMongooseExceptions?: boolean;
  parseTypeORMExceptions?: boolean;
  parseObjectionJSExceptions?: boolean;
  parseKnexJSExceptions?: boolean;
  loggerOptions?: ILoggerOptions;
}
