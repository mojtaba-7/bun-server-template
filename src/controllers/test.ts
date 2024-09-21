import { GetTestService } from '@services';
import { authenticate, authorize, controller, get, post, use, validate } from '@decorators';
import { IStatus, type IRequest, type IResponse } from '@ServerTypes';
import { IUserRole } from '@models';

// TODO: move input interfaces to correct place
interface IInput {
  name: string;
  age: number;
}

function printUrl(req: Request): void {
  console.log(req.url);
}
@controller('/test')
export class test {
  @get('/')
  @use(printUrl)
  @authenticate
  @authorize([IUserRole.user])
  async getTest(req: Request): Promise<IResponse<string[]>> {
    const res = await new GetTestService().handle(req);
    return res;
  }

  @get('/:id')
  getOne(req: IRequest): IResponse<string> {
    return {
      data: JSON.stringify(req.bodyData),
      status: IStatus.success
    };
  }
  @get('/all')
  getAll(req: IRequest): IResponse<string> {
    return {
      data: JSON.stringify(req.bodyData),
      status: IStatus.success
    };
  }

  @post('/')
  @use(printUrl)
  @validate<IInput>({
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'integer' }
    },
    required: ['name', 'age']
  })
  async postTest(req: IRequest): Promise<IResponse<IInput>> {
    const myBody = req.bodyData as IInput;
    return {
      data: myBody,
      status: IStatus.success
    };
  }
}
