import { Test, TestingModule } from '@nestjs/testing';
import { RedisContainer } from '@testcontainers/redis';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { CartModule } from '../src/cart/cart.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const container = await new RedisContainer('redis:alpine')
      .withExposedPorts({ host: 6379, container: 6379 })
      .start();
    console.log(container.getPort());
    console.log(container.getHost());

    console.log(111111);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CartModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/cart').expect(200).expect('Hi');
  });
});
