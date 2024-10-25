import { expect, it, describe } from 'bun:test';
import request from 'supertest';
import { ENV, IStatus } from '@ServerTypes';

const serverUrl = `http://localhost:${ENV.port}`;

describe('Login Controller', () => {
  it('should login successfully with correct credentials', async () => {
    const response = await request(serverUrl).post('/auth/login').send({
      username: 'mojy',
      password: '123456'
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(IStatus.success);
    expect(response.body.data).toHaveProperty('username', 'mojy');
  });

  it('should fail login with incorrect credentials', async () => {
    const response = await request(serverUrl).post('/auth/login').send({
      username: 'testuser',
      password: 'wrongpassword'
    });

    console.log({ body: response.body, status: response.status });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe(IStatus.fail);
    expect(response.body.message).toBe('incorrect password');
  });
});
