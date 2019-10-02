import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';

describe('File Upload', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to upload file', async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', './tmp/test/placeholder_avatar.jpg');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('placeholder_avatar.jpg');
  });
});
