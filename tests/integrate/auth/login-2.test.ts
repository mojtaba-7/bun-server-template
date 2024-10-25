import { expect, it, describe } from 'bun:test';
import request from 'supertest';
import { ENV, IStatus } from '@ServerTypes';

const serverUrl = `http://localhost:${ENV.port}`;

describe('Auth Controller', () => {
  describe('Successful Login', () => {
    it('returns 200 status', async () => {
      const response = await request(serverUrl).post('/auth/login').send({
        username: 'mojy',
        password: '123456'
      });
      expect(response.status).toBe(200);
    });

    it('returns success status in response body', async () => {
      const response = await request(serverUrl).post('/auth/login').send({
        username: 'mojy',
        password: '123456'
      });
      expect(response.body.status).toBe(IStatus.success);
    });

    it('returns user data with correct username', async () => {
      const response = await request(serverUrl).post('/auth/login').send({
        username: 'mojy',
        password: '123456'
      });
      expect(response.body.data).toHaveProperty('username', 'mojy');
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
