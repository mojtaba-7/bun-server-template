import type { ISession, IUser } from '@models';
import type { DocumentType } from '@typegoose/typegoose';

export interface IRequest extends Request {
  bodyData?: Object | undefined;
  user: DocumentType<IUser> | null;
  session: DocumentType<ISession> | null;
  hasSession: boolean;
  ip: string;
  // token: string | undefined;
}

export type IRequestInput = { [key: string]: any };
