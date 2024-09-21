import { LoggerInitialized } from '@decorators';
import { userRepository } from '@repositories';
import type { Logger } from 'winston';
import bcrypt from 'bcryptjs';
import { CustomError } from '@utils';
import { IMessage, IStatus, type IResponse } from '@ServerTypes';
import { sessionRepository } from '../../repositories/sessionRepository';
import { IUserProps, type IUser } from '@models';

export interface ILoginUserInput {
  username: string;
  password: string;
}

export class LoginUser {
  @LoggerInitialized()
  logger!: Logger;

  async handle(data: ILoginUserInput, ip: string, token?: string): Promise<IResponse<Partial<IUser>>> {
    this.logger.info(`Client with ip ${ip} try to login with username: ${data.username}`);

    if (!token) {
      throw CustomError(IMessage.tokenNotFound);
    }

    const user = await userRepository.findByUsername(data.username, IUserProps.system);

    if (!user) {
      throw CustomError(IMessage.userNotFound);
    }

    const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);
    if (!isPasswordCorrect) {
      throw CustomError(IMessage.incorrectPassword);
    }

    const session = await sessionRepository.findByToken(token);
    if (!session) {
      throw CustomError(IMessage.tokenNotFound);
    }

    session.user = user._id;
    await session.save();

    const protectedUser = user.toProps!(IUserProps.self);

    return {
      data: protectedUser,
      status: IStatus.success,
      statusCode: 200
    };
  }
}
