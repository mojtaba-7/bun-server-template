import { authenticate, controller, post, validate } from '@decorators';
import type { IRequest } from '@ServerTypes';
import { StartSessionService, type IStartSerssionInput } from '@services';
import { ISessionLanguage, ISessionPlatform } from '../models/session';

@controller('/')
export class General {
  @post('/session')
  @authenticate
  @validate<IStartSerssionInput>({
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
    const bodyData = req.bodyData as IStartSerssionInput;
    const service = new StartSessionService();
    const result = service.handle(bodyData, req.token);
    return result;
  }
}
