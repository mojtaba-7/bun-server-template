import { controller, post, validate } from '@decorators';
import { IStatus, type IRequest, type IResponseData } from '@ServerTypes';
import { UserService, type ILoginUserInput } from '../services/user/UserService';
import type { IUser } from '@models';

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
  async login(req: IRequest): Promise<IResponseData<IUser>> {
    const body = req.bodyData as ILoginUserInput;
    const userService = new UserService();
    const user = await userService.findWithUsername(body.username);
    await user.validatePassword(body.password);

    return {
      data: user.user!,
      status: IStatus.success
    };
  }
}
