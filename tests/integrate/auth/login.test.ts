import { expect, it, describe, beforeAll, afterAll } from 'bun:test';
import request from 'supertest';
import { ENV, IStatus } from '@ServerTypes';
import { userRepository } from '@services';
import { IUser, IUserRole } from '@models';
import { MongoServiceConfig } from '@serverConfigs';

const serverUrl = `http://localhost:${ENV.port}`;

const userLoginData = {
  username: 'mojtaba_shafiee',
  password: '123456'
};

describe('Auth Controller', () => {
  let user: IUser;
  beforeAll(async () => {
    await MongoServiceConfig.start();
    user = await userRepository.create({
      username: userLoginData.username,
      password: userLoginData.password,
      roles: [IUserRole.user]
    });
  });

  afterAll(async () => {
    if (user) {
      await userRepository.hardDelete(user._id!);
    }
  });

  describe('Successful Login', () => {
    it('returns 200 status', async () => {
      const response = await request(serverUrl).post('/auth/login').send(userLoginData);
      expect(response.status).toBe(200);
    });

    it('returns success status in response body', async () => {
      const response = await request(serverUrl).post('/auth/login').send(userLoginData);
      expect(response.body.status).toBe(IStatus.success);
    });

    it('returns user data with correct username', async () => {
      const response = await request(serverUrl).post('/auth/login').send(userLoginData);
      expect(response.body.data).toHaveProperty('username', userLoginData.username);
    });
  });

  describe('Failed Login', () => {
    it('returns 401 status with incorrect password', async () => {
      const response = await request(serverUrl).post('/auth/login').send({
        username: 'testuser',
        password: 'wrongpassword'
      });
      expect(response.status).toBe(401);
    });

    it('returns fail status in response body for incorrect password', async () => {
      const response = await request(serverUrl).post('/auth/login').send({
        username: 'testuser',
        password: 'wrongpassword'
      });
      expect(response.body.status).toBe(IStatus.fail);
    });

    it('returns error message for incorrect password', async () => {
      const response = await request(serverUrl).post('/auth/login').send({
        username: 'testuser',
        password: 'wrongpassword'
      });
      expect(response.body.message).toBe('incorrect password');
    });
  });
});
