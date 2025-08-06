import request from 'supertest';
import { app, server } from '../src/api/server';

afterAll((done) => {
  server.close(done);
});

describe('API Key system', () => {
  it('rejeita requisição sem chave', async () => {
    const res = await request(app).get('/dump');
    expect(res.status).toBe(401);
  });

  it('permite acesso com chave válida', async () => {
    const res = await request(app).get('/dump').set('x-api-key', 'basic-key');
    expect(res.status).toBe(200);
  });

  it('aplica limite por tier', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get('/dump').set('x-api-key', 'rate-limit-key');
    }
    const res = await request(app).get('/dump').set('x-api-key', 'rate-limit-key');
    expect(res.status).toBe(429);
  });
});
