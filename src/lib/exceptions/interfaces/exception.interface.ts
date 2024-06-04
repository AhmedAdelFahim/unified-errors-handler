export interface IException {
  message: string;
  code?: string;
  fields?: string[];
  details?: { [key: string]: any };
}

export interface IExceptionMapperOptions {
  mapDBExceptions?: boolean;
}
