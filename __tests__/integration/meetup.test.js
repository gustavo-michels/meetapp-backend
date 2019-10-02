import request from 'supertest';

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
        name: 'Pedro da Silva',
        email: 'pedro@gmail.com',
        password: '123456',
      });

    const banner = await request(app)
      .post('/files')
      .attach('file', './tmp/test/banner.png');

    console.log(user.body.id);
    const response = await request(app)
      .post('/meetups')
      .send({
        title: 'Meetup de React Native',
        description:
          'O Meetup de React Native é um evento que reúne a comunidade de desenvolvimento mobile utilizando React a fim de compartilhar conhecimento. Todos são convidados. Caso queira participar como palestrante do meetup envie um e-mail para organizacao@meetuprn.com.br.',
        date: '2019-10-17T15:00:00+03:00',
        location: 'Rua Guilherme Gembala, 260',
        banner_id: banner.body.id,
        user_id: user.body.id,
      });
    console.log(response.body);
    expect(response.status).toBe(201);
  });
});
