export enum IStatus {
  success = 'success',
  fail = 'fail',
  notFound = 'notFound',
  serverError = 'serverError'
}

// TODO move it to best location and handle multi language
export enum IMessage {
  itemCreated = 'item successfuly created!',
  itemNotFound = 'sorry! item not found'
}

export interface IResponse<T> {
  data: T | null;
  documentCount: number;
  timeToResponse: string;
  status: IStatus;
  message?: IMessage;
}
