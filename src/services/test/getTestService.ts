import { LoggerInitialized } from '@decorators';
import { IMessage, IStatus, type IResponse } from '@ServerTypes';
import { CustomError } from '@utils';
import type { Logger } from 'winston';

export class GetTestService {
  @LoggerInitialized()
  logger!: Logger;

  handle(req: Request): IResponse<string[]> | Error {
    // this.logger.info('This is info');
    this.logger.error('This is error');
    // throw CustomError(IMessage.itemNotFound);
    throw new Error('hi');
    return {
      data: ['data for test'],
      status: IStatus.success,
      statusCode: 200
    };
  }
}
