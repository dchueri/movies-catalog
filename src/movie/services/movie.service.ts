import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../../redis/services/redis.service';
import { CreateMovieDTO } from '../dto/create-movie.dto';
import { UpdateMovieDTO } from '../dto/update-movie.dto';
import { MovieEntity } from '../entities/movie.entity';
import MovieNotFoundException from '../exceptions/movie-not-found.exception';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly redisService: RedisService,
  ) {}

  async findAllMovies(): Promise<MovieEntity[]> {
    const cache = await this.redisService.get('movies');
    if (cache) {
      return cache;
    }
    const allMovies = await this.movieRepository.find();
    await this.redisService.set('movies', allMovies);
    return allMovies;
  }

  async addMovie(createMovieDTO: CreateMovieDTO): Promise<MovieEntity> {
    const movie = this.movieRepository.create(createMovieDTO);
    await this.redisService.del('movies');
    return await this.movieRepository.save(movie);
  }

  async findOneMovie(movieId: number): Promise<MovieEntity> {
    const cache = await this.redisService.get('movies');
    if (cache) {
      let movieFound: MovieEntity;
      cache.map((movie) => {
        movie.id == movieId ? (movieFound = movie) : null;
      });
      return movieFound;
    }
    return await this.movieRepository.findOne({ where: { id: movieId } });
  }

  async updateMovie(
    movieId: number,
    updateMovieDTO: UpdateMovieDTO,
  ): Promise<MovieEntity> {
    await this.movieRepository.update(movieId, updateMovieDTO);
    const updatedMovie = await this.findOneMovie(movieId);
    if (updatedMovie) {
      await this.redisService.del('movies');
      return updatedMovie;
    }
    throw new MovieNotFoundException(movieId);
  }

  async deleteMovie(movieId: number) {
    await this.redisService.del('movies');
    return await this.movieRepository.delete({ id: movieId });
  }
}
