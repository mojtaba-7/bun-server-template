import { LoggerInitialized } from '@decorators';
import { IUserLanguage, UserModel } from '@models/user';
import { IStatus, type IResponse } from '@ServerTypes';
import type { Logger } from 'winston';

export class GetTestService {
  @LoggerInitialized()
  logger!: Logger;

  async handle(req: Request): Promise<IResponse<string[]> | Error> {
    this.logger.error('This is error');
    const user = new UserModel({
      name: 'Mojtaba',
      age: 24,
      balance: 10,
      language: IUserLanguage.english
    });
    await user.save();

    this.logger.info({ user });
    return {
      data: ['data for test'],
      status: IStatus.success,
      statusCode: 200
    };
  }
}
