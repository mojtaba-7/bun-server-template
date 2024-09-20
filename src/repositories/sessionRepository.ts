import { ISession, SessionModel } from '../models/session';
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
}

export const sessionRepository = new SessionRepository();