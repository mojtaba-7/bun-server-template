import { getModelForClass, prop } from '@typegoose/typegoose';

export enum IUserLanguage {
  english = 'en',
  germany = 'de'
}

export enum IUserRole {
  user = 'user',
  superAdmin = 'superAdmin'
}

export class IUser {
  @prop()
  public name?: string;

  @prop({ required: true })
  public age!: number; // This is a single Primitive

  @prop({ enum: IUserLanguage, required: true, type: String })
  public language!: IUserLanguage;

  @prop({
    validate: {
      validator: (input) => {
        return input <= 10;
      },
      message: 'value grather than 10'
    }
  })
  public balance!: number;

  @prop({ enum: IUserRole, type: String, default: [IUserRole.user] })
  roles!: IUserRole[];
}

export const UserModel = getModelForClass(IUser)<IUser>;
