import { getModelForClass, index, modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { IUser } from './user';
import { Document } from 'mongoose';

export enum ISessionStatus {
  active = 'active',
  deactive = 'deactive',
  removed = 'removed'
}

export enum ISessionLanguage {
  english = 'en',
  germany = 'de'
}

export enum ISessionPlatform {
  system = 'system',
  web = 'web',
  android = 'android',
  ios = 'ios'
}

@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    customName: 'sessions'
  }
})
@index({ status: 1, token: 1 })
export class ISession {
  @prop({ unique: true })
  public token!: string;

  @prop({ ref: () => IUser })
  public user?: Ref<IUser>;

  @prop({ enum: ISessionStatus, type: String, default: ISessionStatus.active })
  public status!: ISessionStatus;

  @prop({ enum: ISessionLanguage, required: true, type: String })
  public language!: ISessionLanguage;

  @prop({ enum: ISessionPlatform, required: true, type: String })
  public platform!: ISessionPlatform;

  @prop()
  public build?: number;

  @prop()
  public device?: string;
}

export const SessionModel = getModelForClass(ISession)<ISession>;
