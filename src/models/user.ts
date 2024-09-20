import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

export enum IUserRole {
  user = 'user',
  superAdmin = 'superAdmin'
}
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    customName: 'users'
  }
})
export class IUser {
  @prop()
  public name?: string;

  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ enum: IUserRole, type: String, default: [IUserRole.user] })
  roles!: IUserRole[];
}

export const UserModel = getModelForClass(IUser)<IUser>;
