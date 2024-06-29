import path from 'path';
import loggerFormatter from './logger-formatter';
import ILogger, { FileLoggerOptions } from './logger.interface';
import fs from 'fs';
import { getProjectRootPath, createDirIfNotExist } from '../utils/file-utils';
import { isNil } from '../utils/utils-functions';
import moment from 'moment';

class FileLogger implements ILogger {
  private defaultFileName = 'logs-%DATE%.log';

  private getFileName(fileName: string) {
    const date = moment().format('YYYY-MM-DD');
    return fileName.replace(/\%DATE\%/g, date);
  }

  private validateFileSize(fileSize: string) {
    const isValid = /[0-9]+(KB|MB|GB)/.test(fileSize);
    if (!isValid) {
      throw new Error(`${fileSize} is invalid.\nValid examples: 10KB, 1MB, 1GB`);
    }
  }

  log(error: Error, loggingOptions?: FileLoggerOptions): void {
    const format: any = loggingOptions?.format;
    const maxFileSize: any = loggingOptions?.maxFileSize;
    const userPath: any = loggingOptions?.path;
    const filename = this.getFileName(loggingOptions?.fileName || this.defaultFileName);
    const projectRootPath = getProjectRootPath();
    let loggingPath = projectRootPath;

    let errorStr = error.message;
    if (!isNil(maxFileSize)) {
      this.validateFileSize(maxFileSize);
    }
    if (!isNil(format)) {
      loggerFormatter.validateFormat(format);
      errorStr = loggerFormatter.formatError(error, format);
    }

    if (!isNil(userPath)) {
      loggingPath = path.join(projectRootPath, userPath);
    }
    createDirIfNotExist(loggingPath);
    loggingPath = path.join(loggingPath, filename);
    fs.appendFileSync(loggingPath, errorStr);
  }
}

export default new FileLogger();
