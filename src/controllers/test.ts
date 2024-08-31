import { controller, get } from '../decorators';
import { use } from '../decorators/use';

function logger(req: Request): void {
  console.log(req.url);
}
@controller('/test')
export class test {
  @get('/')
  @use(logger)
  getTest(req: Request): Object {
    return {
      data: 'this data is only for test'
    };
  }
}
