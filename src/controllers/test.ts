import { GetTestService } from '@services';
import { controller, get } from '../decorators';
import { use } from '../decorators/use';

function printUrl(req: Request): void {
  console.log(req.url);
}
@controller('/test')
export class test {
  @get('/')
  @use(printUrl)
  getTest(req: Request): Object {
    const res = new GetTestService().handle(req);
    return {
      data: res
    };
  }
}
