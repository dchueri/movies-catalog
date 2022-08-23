import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../../common/test/TestUtil';
import { RedisService } from '../../redis/services/redis.service';
import { MovieEntity } from '../entities/movie.entity';
import InvalidMovieErrorException from '../exceptions/invalid-data-of-movie.exception';
import MovieNotFoundException from '../exceptions/movie-not-found.exception';
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

  /*   beforeEach(() => {
    mockRepository.get.mockReset();
    mockRepository.set.mockReset();
    mockRepository.del.mockReset();
    mockRepository.find.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  }); */

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

  describe('findUserById', () => {
    it('should be find a existring movie by id in DB', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.findOne.mockReturnValue(movie);
      const movieFound = await service.findOneMovie(1);
      expect(movieFound).toMatchObject(movie);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a movie', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findOneMovie(1000)).rejects.toBeInstanceOf(
        MovieNotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createMovie', () => {
    it('should add a movie', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.save.mockReturnValue(movie);
      mockRepository.create.mockReturnValue(movie);
      const savedMovie = await service.addMovie(movie);
      expect(savedMovie).toMatchObject(movie);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt add a movie', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(movie);

      await service.addMovie(movie).catch((e) => {
        expect(e).toBeInstanceOf(InvalidMovieErrorException);
        expect(e).toMatchObject({
          message: 'The movie have invalids informations. Try again.',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(2);
      expect(mockRepository.save).toBeCalledTimes(2);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.update.mockReturnValue(movie);
      mockRepository.findOne.mockReturnValue(movie);
    });
  });
});
