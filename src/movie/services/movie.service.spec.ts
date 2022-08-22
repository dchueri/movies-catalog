import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../../common/test/TestUtil';
import { RedisService } from '../../redis/services/redis.service';
import { MovieEntity } from '../entities/movie.entity';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;

  const mockRepository = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        MovieService,
        RedisService,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllMovies', () => {
    it('should be list all movies', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.find.mockReturnValue([movie, movie]);
      const movies = await service.findAllMovies();
      expect(movies).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
