import request from 'supertest';
import { subDays, addDays } from 'date-fns';

import app from '../../src/app';

import truncate from '../util/truncate';

describe('Meetup', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to create a meetup', async () => {
    const user = await request(app)
      .post('/users')
      .send({
        name: 'Carol da Silva',
        email: 'carol@gmail.com',
        password: '123456',
      });

    const token = await request(app)
      .post('/sessions')
      .send({
        email: user.body.email,
        password: '123456',
      });

    const banner = await request(app)
      .post('/files')
      .set({ Authorization: `bearer ${token.body.token}` })
      .attach('file', './tmp/test/banner.png');

    const response = await request(app)
      .post('/meetups')
      .set({ Authorization: `bearer ${token.body.token}` })
      .send({
        title: 'Meetup de React Native',
        description:
          'O Meetup de React Native é um evento que reúne a comunidade de desenvolvimento mobile utilizando React a fim de compartilhar conhecimento. Todos são convidados. Caso queira participar como palestrante do meetup envie um e-mail para organizacao@meetuprn.com.br.',
        date: addDays(new Date(), 1),
        location: 'Rua Guilherme Gembala, 260',
        banner_id: banner.body.id,
      });
    expect(response.status).toBe(201);
  });

  it('should not be possible to register an meetup with a date passed', async () => {
    const pastDate = subDays(new Date(), 1);

    const user = await request(app)
      .post('/users')
      .send({
        name: 'Caio da Silva',
        email: 'caio@gmail.com',
        password: '123456',
      });

    const token = await request(app)
      .post('/sessions')
      .send({
        email: user.body.email,
        password: '123456',
      });

    const banner = await request(app)
      .post('/files')
      .set({ Authorization: `bearer ${token.body.token}` })
      .attach('file', './tmp/test/banner.png');

    const response = await request(app)
      .post('/meetups')
      .set({ Authorization: `bearer ${token.body.token}` })
      .send({
        title: 'Meetup de React Native',
        description:
          'O Meetup de React Native é um evento que reúne a comunidade de desenvolvimento mobile utilizando React a fim de compartilhar conhecimento. Todos são convidados. Caso queira participar como palestrante do meetup envie um e-mail para organizacao@meetuprn.com.br.',
        date: pastDate,
        location: 'Rua Guilherme Gembala, 260',
        banner_id: banner.body.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('The date you entered has passed.');
  });
});
