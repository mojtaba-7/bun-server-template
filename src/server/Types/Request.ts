import type { IUser } from '@models*';

export interface IRequest extends Request {
  bodyData?: Object | undefined;
  user: IUser | null;
}

export type IRequestInput = { [key: string]: any };
