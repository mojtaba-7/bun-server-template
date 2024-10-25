import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { schemaToProps } from '../utils/model/schemaHelpers';
import mongoose from 'mongoose';

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
  public _id?: mongoose.Types.ObjectId; // Explicitly declare _id

  @prop()
  public name?: string;

  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ enum: IUserRole, type: String, default: [IUserRole.user] })
  roles!: IUserRole[];

  toProps?(props: typeof IUserProps) {
    return schemaToProps<IUser, any>(this, props);
  }
}

type UserFieldNames = {
  [K in keyof IUser]: string;
};

export const UserFields: UserFieldNames = new Proxy<UserFieldNames>({} as UserFieldNames, {
  get: (_, property) => property.toString
});

export const IUserProps = {
  system: [UserFields.name, UserFields.username, UserFields.roles, UserFields.password],
  self: [UserFields.name, UserFields.username, UserFields.roles]
};

export const UserModel = getModelForClass(IUser)<IUser>;
