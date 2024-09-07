import { GetTestService } from '@services';
import { controller, get, post, use, validate } from '@decorators';
import { IStatus, type IRequest, type IResponse } from '@ServerTypes';

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
  getTest(req: Request): IResponse<string[]> {
    const res = new GetTestService().handle(req);
    return res;
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
