import { controller, post, validate } from '@decorators';
import type { IRequest } from '@ServerTypes';
import { LoginUser, type ILoginUserInput } from '../services/auth/login';

@controller('/auth')
export class Auth {
  @post('/login')
  @validate<ILoginUserInput>({
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'password']
  })
  async login(req: IRequest) {
    const body = req.bodyData as ILoginUserInput;
    const handler = new LoginUser();
    const result = await handler.handle(body, req.ip, req.token);

    return result;
  }
}
