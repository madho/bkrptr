// src/utils/logger.ts

import * as winston from 'winston';

export class Logger {
  private logger: winston.Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: 'bkrptr-error.log',
          level: 'error'
        }),
        new winston.transports.File({
          filename: 'bkrptr.log'
        }),
      ],
    });

    // Add console transport for development
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        })
      );
    }
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, error?: any): void {
    this.logger.error(message, { error });
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }
}
