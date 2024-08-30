export enum IMetadataKeys {
  ALL_ENDPOINT = 'ALL_ENDPOINT',
  path = 'path',
  method = 'method'
}

export enum IMethodType {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  del = 'DELETE'
}

// TODO: fix this any type
export type ITypedHandlerDescriptor = (req: Request) => any;

export interface IEndPoint {
  handler: ITypedHandlerDescriptor;
  route: string;
  method: string;
}
