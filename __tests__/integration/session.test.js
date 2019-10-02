import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return JWT token when session created', async () => {
    const user = await request(app)
      .post('/users')
      .send({
        name: 'João da silva',
        email: 'test@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'test@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(user.body.id);
  });
});
