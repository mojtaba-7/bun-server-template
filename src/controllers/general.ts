import { authenticate, controller, post, validate } from '@decorators';
import { IStatus, type IRequest } from '@ServerTypes';
import { ISessionLanguage, ISessionPlatform } from '../models/session';
import { SessionService, type IInitialSessionData } from '@services';
import { UserService } from '../services/user/UserService';

@controller('/')
export class General {
  @post('/session')
  @authenticate
  @validate<IInitialSessionData>({
    type: 'object',
    properties: {
      language: { type: 'string', nullable: true, default: ISessionLanguage.english },
      platform: { type: 'string', nullable: true, default: ISessionPlatform.web },
      build: { type: 'number', nullable: true },
      device: { type: 'string', nullable: true }
    },
    additionalProperties: false
  })
  async startSession(req: IRequest) {
    const bodyData = req.bodyData as IInitialSessionData;
    const sessionService = new SessionService();
    if (req.hasSession) {
      sessionService.updateSession(req.session?._id!, bodyData);
    } else {
      sessionService.initialSession(bodyData);
    }
    return {
      data: sessionService.session,
      status: IStatus.success
    };
  }
}
