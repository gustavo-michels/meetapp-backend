import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';

describe('File Upload', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to upload file', async () => {
    const user = await request(app)
      .post('/users')
      .send({
        name: 'Fabricio da Silva',
        email: 'fabricio@gmail.com',
        password: '123456',
      });

    const token = await request(app)
      .post('/sessions')
      .send({
        email: user.body.email,
        password: '123456',
      });

    const response = await request(app)
      .post('/files')
      .set({ Authorization: `bearer ${token.body.token}` })
      .attach('file', './tmp/test/placeholder_avatar.jpg');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('placeholder_avatar.jpg');
  });
});
