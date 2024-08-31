import { IMetadataKeys, type ITypedHandlerDescriptor } from './TypeKeys';

export function use(functionToRun: Function) {
  return function (targer: Object, key: string, desc: TypedPropertyDescriptor<ITypedHandlerDescriptor>) {
    const middlewares: Function[] = Reflect.getMetadata(IMetadataKeys.customMiddleware, targer, key) || [];

    middlewares.push(functionToRun);

    Reflect.defineMetadata(IMetadataKeys.customMiddleware, middlewares, targer, key);
  };
}
