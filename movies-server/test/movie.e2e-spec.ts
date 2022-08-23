import { CacheModule, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import TestUtil from '../src/common/test/TestUtil';
import { MovieModule } from '../src/movie/movie.module';
import { MovieService } from '../src/movie/services/movie.service';
import { RedisModule } from '../src/redis/redis.module';

describe('MovieController', () => {
  let app: INestApplication;
  let movieService: MovieService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MovieModule, RedisModule, CacheModule.register()],
    })
      .overrideProvider(MovieService)
      .useValue(movieService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create new movie', () => {
    const movie = TestUtil.giveMeAValidMovie();
    return request(app.getHttpServer())
      .post('/movie/add')
      .send(movie)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
