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
  public age!: number; // This is a single Primitive

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
