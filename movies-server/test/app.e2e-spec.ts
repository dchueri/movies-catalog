import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import TestUtil from '../src/common/test/TestUtil';

import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AuthService } from '../src/auth/services/auth.service';

describe('User', () => {
  const user = TestUtil.giveMeAValidUser();
  const mockUserRepository = [user, user];
  let app: INestApplication;
  let authService = { login: () => [{ accessToken: 'token', userName: 'a' }] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/ (GET) `, async () => {
    await request(app.getHttpServer()).get('/').expect(200);
  });

  it(`/auth/signin (POST) `, async () => {
    await request(app.getHttpServer())
      .post('auth/signin')
      .send({ userName: 'userName', password: 'password' })
      .expect(200);
  });
});
