import { LoggerInitialized } from '@decorators';
import type { Logger } from 'winston';
import { sessionRepository } from '../../repositories/sessionRepository';
import { IStatus, type IResponse } from '@ServerTypes';
import { ISessionStatus, type ISession, type ISessionLanguage, type ISessionPlatform } from '../../models/session';

export interface IStartSerssionInput {
  language?: ISessionLanguage;
  platform?: ISessionPlatform;
  build?: number;
  device?: string;
}

export class StartSessionService {
  @LoggerInitialized()
  public logger!: Logger;

  async handle(data: IStartSerssionInput, lastSessionToken?: string): Promise<IResponse<ISession>> {
    let session;
    if (lastSessionToken) {
      session = await sessionRepository.updateOneByToken(lastSessionToken, data);
    }

    if (!session) {
      session = await sessionRepository.create({
        language: data.language!,
        platform: data.platform!,
        status: ISessionStatus.active,
        token: sessionRepository.newToken
      });
    }

    return {
      data: session,
      status: IStatus.success
    };
  }
}
