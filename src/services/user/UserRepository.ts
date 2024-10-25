import { IUser, IUserProps, UserModel, type ObjectIDType } from '@models';
import bcrypt from 'bcryptjs';
import type {} from 'mongoose';

class UserRepository {
  private salt = bcrypt.genSaltSync(10);

  async findName(name: string) {
    return UserModel.find({
      name: new RegExp(name, 'i')
    });
  }
  async findByUsername(username: string) {
    return UserModel.findOne({
      username: username
    });
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

  /**
   * Permanently deletes a user from the database by their user ID.
   *
   * WARNING: This function permanently deletes the specified user!
   * Use with caution, as this action is irreversible and could lead to data loss.
   *
   * @async
   * @function hardDelete
   * @param {ObjectIDType<IUser>} userId - The ID of the user to be deleted.
   * @returns {Promise<{ acknowledged: boolean; deletedCount: number }>} The result of the delete operation.
   */
  async hardDelete(userId: ObjectIDType<IUser>) {
    return UserModel.deleteOne({
      _id: userId
    });
  }
}

export const userRepository = new UserRepository();
