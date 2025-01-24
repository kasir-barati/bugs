import { Test, TestingModule } from '@nestjs/testing';
import { RedisContainer } from '@testcontainers/redis';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createClient } from 'redis';
import { CartModule } from '../src/cart/cart.module';

describe.only('test redis', () => {
  it('should work', async () => {
    const container = await new RedisContainer('redis:alpine')
      .withExposedPorts({ host: 6379, container: 6379 })
      // .withUser('username')
      // .withPassword('password')
      .start();

    console.log(container.getConnectionUrl());

    const client = createClient({ url: container.getConnectionUrl() });

    await client.connect();
    expect(client.isOpen).toBeTruthy();

    await client.set('key', 'val');
    expect(await client.get('key')).toBe('val');

    await client.disconnect();
    await container.stop();
  });
});

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const container = await new RedisContainer('redis:alpine')
      .withExposedPorts({ host: 6379, container: 6379 })
      .start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CartModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 22222222222 + 1111111111);

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/cart').expect(200).expect('Hi');
  });
});

function sleep() {
  return new Promise((res, rej) => setTimeout(res, 22222222222));
}
