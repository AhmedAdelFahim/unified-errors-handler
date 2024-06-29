import moment from 'moment';

class LoggerFormatter {
  protected formatRegex = {
    time: /^:time(\{\{.+\}\})?$/,
    message: /^:message$/,
    stack: /^:stack$/,
  };
  validateFormat(format: string) {
    const parts = format.split(' ');

    const validParts = Object.values(this.formatRegex);
    parts.forEach((part) => {
      let isValid = false;
      validParts.forEach((reg) => {
        if (reg.test(part)) {
          isValid = true;
          return;
        }
      });
      if (!isValid) {
        throw new Error('Invalid Logging Format');
      }
    });
  }

  formatError(error: Error, format: string) {
    const message = error.message;
    const stack = error.stack;
    const parts = format.split(' ');
    const formattedError = parts.map((part) => {
      if (this.formatRegex.time.test(part)) {
        let defaultTimeFormat = 'YYYY-MM-DDTHH:mm:ss.sss Z';
        const customTimeFormat = part.replace(':time', '').replace(/\{\{/, '').replace(/\}\}/, '');
        if (customTimeFormat.length > 0) {
          defaultTimeFormat = customTimeFormat;
        }
        const now = moment().utc().format(defaultTimeFormat);
        return now;
      } else if (this.formatRegex.message.test(part)) {
        return message;
      } else if (this.formatRegex.stack.test(part)) {
        return stack;
      }
    });
    return formattedError.join(' - ') + '\n';
  }
}

export default new LoggerFormatter();
