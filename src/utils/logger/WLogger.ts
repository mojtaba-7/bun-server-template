import { ENV } from '@ServerTypes';
import { createLogger, format, transports, Logger } from 'winston';

/* Winston Logger */
export class LoggerUtil {
  private static instance: Logger;

  // Method to get the logger instance
  public static getLogger(): Logger {
    if (!LoggerUtil.instance) {
      LoggerUtil.instance = createLogger({
        level: 'info',
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          })
        ),
        transports: [new transports.Console(), new transports.File({ filename: ENV.appLogFile })]
      });
    }
    return LoggerUtil.instance;
  }
}
