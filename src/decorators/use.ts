import { IMetadataKeys, type ITypedHandlerDescriptor } from './TypeKeys';

export function use(functionToRun: Function) {
  // TODO: create new type for desc middleware
  return function (targer: Object, key: string, desc: TypedPropertyDescriptor<any>) {
    const middlewares: Function[] = Reflect.getMetadata(IMetadataKeys.customMiddleware, targer, key) || [];

    middlewares.push(functionToRun);

    Reflect.defineMetadata(IMetadataKeys.customMiddleware, middlewares, targer, key);
  };
}
