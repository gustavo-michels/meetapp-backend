import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
import factory from '../factories';

import User from '../../src/app/models/User';

import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare(user.password, user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User', { email: 'test@gmail.com' });

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should be able to update user data.', async () => {
    const user = await factory.attrs('User', {
      name: 'João da Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    await request(app)
      .post('/users')
      .send(user);

    const token = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      });

    const response = await request(app)
      .put(`/users`)
      .set({ Authorization: `bearer ${token.body.token}` })
      .send({
        name: 'João Dos Santos',
        email: 'joao2@gmail.com',
        oldPassword: '123456',
        password: '12345678',
        confirmPassword: '12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('João Dos Santos');
    expect(response.body.email).toBe('joao2@gmail.com');

    const userUpdated = await User.findByPk(response.body.id);

    const compareHash = await bcrypt.compare(
      '12345678',
      userUpdated.password_hash
    );

    expect(compareHash).toBe(true);
  });
});
