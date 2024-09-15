import { IUser, UserModel } from '@models';

class UserRepository {
  async findName(name: string) {
    return UserModel.find({
      name: new RegExp(name, 'i')
    });
  }

  async findById(id: string) {
    return UserModel.findById(id);
  }

  async create(options: IUser) {
    const user = new UserModel(options);
    await user.save();
    return user;
  }
}

export const userRepository = new UserRepository();
