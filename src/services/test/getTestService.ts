import { LoggerInitialized } from '@decorators';
import type { Logger } from 'winston';

export class GetTestService {
  @LoggerInitialized()
  logger!: Logger;

  handle(req: Request): string {
    this.logger.info('This is info');
    this.logger.error('This is info');
    return 'Service handler testing';
  }
}
