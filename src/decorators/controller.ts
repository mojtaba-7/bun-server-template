import 'reflect-metadata';
import { IMetadataKeys, IMethodType, type IEndPoint } from './TypeKeys';
import { convertToPathPrefixSafty } from './helpers';

const allEndpoint: IEndPoint[] = [];

export function controller(pathPrefix: string) {
  return function (target: Function): void {
    let controllerFunctionNames = Object.getOwnPropertyNames(target.prototype);
    controllerFunctionNames = controllerFunctionNames.filter((cfm) => cfm !== 'constructor');

    for (let controllerFunctionName of controllerFunctionNames) {
      const handler = target.prototype['getTest'];
      const route = Reflect.getMetadata(IMetadataKeys.path, target.prototype, controllerFunctionName);
      const method = Reflect.getMetadata(IMetadataKeys.method, target.prototype, controllerFunctionName) as IMethodType;

      // TODO: handle middleware
      const safePathPrefix = convertToPathPrefixSafty(pathPrefix, route);

      allEndpoint.push({
        handler,
        route: safePathPrefix,
        method
      });
    }
  };
}

export function getAllEndPoints() {
  return allEndpoint;
}
