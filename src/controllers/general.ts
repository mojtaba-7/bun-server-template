import { authenticate, controller, post, get, validate } from '@decorators';
import { IStatus, type IRequest } from '@ServerTypes';
import { ISessionLanguage, ISessionPlatform } from '../models/session';
import { SessionService, type IInitialSessionData } from '@services';

@controller('/')
export class General {
  @get('/ping')
  ping(req: IRequest) {
    return {
      data: 'pong',
      status: IStatus.success
    };
  }

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
