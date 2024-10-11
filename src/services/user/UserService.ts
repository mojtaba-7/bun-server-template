import { LoggerInitialized } from '@decorators';
import { userRepository } from './UserRepository';
import type { Logger } from 'winston';
import bcrypt from 'bcryptjs';
import { CustomError } from '@utils';
import { IMessage, IStatus, type IResponse } from '@ServerTypes';
import { IUserProps, type IUser } from '@models';

export interface ILoginUserInput {
  username: string;
  password: string;
}

export class UserService {
  @LoggerInitialized()
  logger!: Logger;

  user?: IUser;

  constructor(user?: IUser) {
    this.user = user;
  }

  async findWithUsername(username: string) {
    const user = await userRepository.findByUsername(username, IUserProps.system);

    if (!user) {
      throw CustomError(IMessage.userNotFound);
    }

    return this;
  }

  async validatePassword(password: string) {
    const userPassword = this.user?.password!;
    const isPasswordCorrect = bcrypt.compareSync(password, userPassword);
    if (!isPasswordCorrect) {
      throw CustomError(IMessage.incorrectPassword);
    }
  }
}
