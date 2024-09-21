import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { schemaToProps } from '../utils/model/schemaHelpers';

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

  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ enum: IUserRole, type: String, default: [IUserRole.user] })
  roles!: IUserRole[];

  toProps?(props: IUserProps) {
    return schemaToProps<IUser, IUserProps>(this, props);
  }
}

export enum IUserProps {
  system = 'name username roles password',
  self = 'name username roles'
}

export const UserModel = getModelForClass(IUser)<IUser>;
