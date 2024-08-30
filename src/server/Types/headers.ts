import { IMethodType } from '@decorators';

type IHeadersTypes = {
  'Content-Type': string;
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
};

enum IValidAllowOrigin {
  allSites = '*'
}

enum IValidContentTypes {
  json = 'application/json'
}

// TODO: add another headers (from postman or other application)
enum IValidHeaderTypes {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
  loginToken = 'lt',
  language = 'lang'
}
const validHeaderValues: IValidHeaderTypes[] = [
  IValidHeaderTypes.ContentType,
  IValidHeaderTypes.Authorization,
  IValidHeaderTypes.loginToken,
  IValidHeaderTypes.language
];

const validMethodValues: IMethodType[] = [IMethodType.get, IMethodType.post, IMethodType.put, IMethodType.del];

export function getHeaders(): IHeadersTypes {
  return {
    'Content-Type': IValidContentTypes.json,
    'Access-Control-Allow-Headers': validHeaderValues.join(', '),
    'Access-Control-Allow-Methods': validMethodValues.join(', '),
    'Access-Control-Allow-Origin': IValidAllowOrigin.allSites
  };
}
