import { LoggerInitialized } from '@decorators';
import { IUserRole } from '@models';
import { userRepository } from '@repositories';
import { IStatus, type IResponse } from '@ServerTypes';
import type { Logger } from 'winston';

export class GetTestService {
  @LoggerInitialized()
  logger!: Logger;

  async handle(req: Request): Promise<IResponse<string[]> | Error> {
    this.logger.error('This is error');
    const user = await userRepository.create({
      name: 'Mojtaba',
      age: 24,
      balance: 10,
      roles: [IUserRole.user]
    });

    this.logger.info({ user });
    return {
      data: ['data for test'],
      status: IStatus.success,
      statusCode: 200
    };
  }
}
