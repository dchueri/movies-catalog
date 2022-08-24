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
  let cacheService: RedisService;
  let movieService: MovieEntity;

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
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        MovieService,
        RedisService,
        MovieEntity,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieService = module.get<MovieEntity>(MovieEntity);
    cacheService = module.get<RedisService>(RedisService);
  });

  describe('When find all movies', () => {
    it('should be list all movies from DB', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.find.mockReturnValue([movie, movie]);
      const movies = await service.findAllMovies();
      expect(movies).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should be list all movies from Cache', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      jest
        .spyOn(cacheService, 'get')
        .mockReturnValue(new Promise((resolve) => resolve([movie, movie])));
      const movies = await service.findAllMovies();
      expect(movies).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When find one movie by Id', () => {
    it('should be find a existing movie by id in DB', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.findOne.mockReturnValue(movie);
      const movieFound = await service.findOneMovie(1);
      expect(movieFound).toMatchObject(movie);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should be find a existing movie by id in Cache', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      jest
        .spyOn(cacheService, 'get')
        .mockReturnValue(new Promise((resolve) => resolve([movie, movie])));
      const foundMovie = await service.findOneMovie(1);
      expect(foundMovie).toBe(movie);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a movie', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findOneMovie(1000)).rejects.toBeInstanceOf(
        MovieNotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create a movie', () => {
    it('should add a movie', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.save.mockReturnValue(movie);
      mockRepository.create.mockReturnValue(movie);
      const savedMovie = await service.addMovie(movie);
      expect(savedMovie).toMatchObject(movie);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt add a movie because a invalid input', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(null);
      movie.name = '';
      await service.addMovie(movie).catch((e) => {
        expect(e).toBeInstanceOf(InvalidMovieErrorException);
        expect(e).toMatchObject({
          message: 'The movie have invalids informations. Try again.',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When update a movie', () => {
    it('should update a movie', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      const updatedMovie = { name: 'Test movie' };
      mockRepository.findOne.mockReturnValue(movie);
      mockRepository.update.mockReturnValue({
        ...movie,
        ...updatedMovie,
      });

      const resultMovie = await service.updateMovie(1, {
        ...movie,
        ...updatedMovie,
      });
      expect(resultMovie).toMatchObject(updatedMovie);
      expect(mockRepository.findOne).toBeCalledTimes(3);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('When delete a movie', () => {
    it('should delete a existing movie', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.delete.mockReturnValue({ raw: [], affected: 1 });
      const deletedMovie = await service.deleteMovie(movie.id);
      expect(deletedMovie).toBe(true);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('should not delete a inexisting movie', async () => {
      const movie = TestUtil.giveMeAValidMovie();
      mockRepository.delete.mockReturnValue({ raw: [], affected: 0 });
      await service.deleteMovie(movie.id).catch((e) => {
        expect(e).toBeInstanceOf(MovieNotFoundException);
        expect(e).toMatchObject({
          message: `Movie with id '${movie.id}' not found`,
        });
      });
      expect(mockRepository.delete).toBeCalledTimes(2);
    });
  });
});
