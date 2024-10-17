import { ISessionStatus, type ISession, type ISessionLanguage, type ISessionPlatform, type IUser } from '@models';
import type { ObjectIDType } from '@models';
import { sessionRepository } from './SessionRepository';
import { LoggerInitialized } from '@decorators';
import type { Logger } from 'winston';

export interface IInitialSessionData {
  language?: ISessionLanguage;
  platform?: ISessionPlatform;
  build?: number;
  device?: string;
}

export class SessionService {
  @LoggerInitialized()
  public logger!: Logger;

  session: ISession | null = null;
  user?: IUser;

  constructor(user?: IUser) {
    this.user = user;
  }

  async updateSession(sessionId: ObjectIDType<ISession>, updateData: Partial<ISession>) {
    this.session = await sessionRepository.updateOneById(sessionId, updateData);
  }

  async initialSession(initialSessionData: IInitialSessionData) {
    const session = await sessionRepository.create({
      language: initialSessionData.language!,
      platform: initialSessionData.platform!,
      status: ISessionStatus.active,
      token: sessionRepository.newToken
    });
    this.session = session;
  }
}
