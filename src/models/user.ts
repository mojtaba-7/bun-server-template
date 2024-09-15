import { getModelForClass, prop } from '@typegoose/typegoose';

export enum IUserLanguage {
  english = 'en',
  germany = 'de'
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
}

export const UserModel = getModelForClass(IUser)<IUser>;
