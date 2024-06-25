import ILogger from '../../../../lib/logger/logger.interface';

class CustomLogger implements ILogger {
  log(error: any): void {
    console.log(error.message);
  }
}

export default new CustomLogger();
