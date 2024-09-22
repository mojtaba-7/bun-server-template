import type { Document, ObjectId } from 'mongoose';
import { ISession, SessionModel } from '../models/session';
import Crypto from 'node:crypto';
import type { DocumentType } from '@typegoose/typegoose';
import type { ObjectIDType } from '../models/Types';

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
    });
  }

  async updateOneByToken(token: string, options: Partial<ISession>) {
    return SessionModel.findOneAndUpdate({ token: token }, options, { new: true });
  }

  // async updateByDoc(_doc: DocumentType<ISession>) {
  //   _doc
  // }
}

export const sessionRepository = new SessionRepository();
