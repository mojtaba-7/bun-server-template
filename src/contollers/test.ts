import { controller, get } from '../decorators';

@controller('/test')
class test {
  @get('/')
  getTest(req: Request): Object {
    console.log('This is my test function at all');
    return {
      data: 'this data is only for test'
    };
  }
}
