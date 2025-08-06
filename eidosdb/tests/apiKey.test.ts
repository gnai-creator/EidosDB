import request from 'supertest';
import { app, server } from '../src/api/server';
import fs from 'fs';
import path from 'path';

const keyFile = path.join(__dirname, '..', 'data', 'api-keys.json');
const originalKeys = fs.readFileSync(keyFile, 'utf-8');

afterAll((done) => {
  fs.writeFileSync(keyFile, originalKeys);
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

  it('gera nova chave e permite uso imediato', async () => {
    const resKey = await request(app)
      .post('/api/keys')
      .set('Authorization', 'Bearer test');
    expect(resKey.status).toBe(201);
    const nova = resKey.body.key;
    const res = await request(app).get('/dump').set('x-api-key', nova);
    expect(res.status).toBe(200);
  });
});
