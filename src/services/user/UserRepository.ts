import { IUser, IUserProps, UserModel } from '@models';
import bcrypt from 'bcryptjs';

class UserRepository {
  private salt = bcrypt.genSaltSync(10);

  async findName(name: string) {
    return UserModel.find({
      name: new RegExp(name, 'i')
    });
  }
  async findByUsername(username: string, props: typeof IUserProps) {
    return UserModel.findOne(
      {
        username: username
      },
      props
    );
  }

  async findById(id: string) {
    return UserModel.findById(id);
  }

  async create(options: IUser) {
    const hashedPassword = bcrypt.hashSync(options.password, this.salt);
    const user = new UserModel({
      ...options,
      password: hashedPassword
    });
    await user.save();
    return user;
  }
}

export const userRepository = new UserRepository();
