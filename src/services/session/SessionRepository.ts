import { ISession, SessionFields, SessionModel, UserModel, type ObjectIDType } from '@models';
import Crypto from 'node:crypto';

class SessionRepository {
  get newToken() {
    return Crypto.randomBytes(32).toString('base64');
  }

  async create(options: ISession) {
    const session = new SessionModel({
      ...options
    });
    await session.save();
    return session;
  }

  async findByToken(token: string) {
    return SessionModel.findOne({
      token: token
    }).populate([
      {
        path: SessionFields.user!
      }
    ]);
  }

  async updateOneByToken(token: string, options: Partial<ISession>) {
    return SessionModel.findOneAndUpdate({ token: token }, options, { new: true });
  }

  async updateOneById(id: ObjectIDType<ISession>, options: Partial<ISession>) {
    return SessionModel.findOneAndUpdate({ _id: id }, options, { new: true });
  }
}

export const sessionRepository = new SessionRepository();
