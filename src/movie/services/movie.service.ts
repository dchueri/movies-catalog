import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDTO } from '../dto/create-movie.dto';
import { UpdateMovieDTO } from '../dto/update-movie.dto';
import { MovieEntity } from '../entities/movie.entity';
import MovieNotFoundException from '../exceptions/movie-not-found.exception';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async getMovies(): Promise<MovieEntity[]> {
    return await this.movieRepository.find();
  }

  async addMovie(createMovieDTO: CreateMovieDTO): Promise<MovieEntity> {
    const movie = this.movieRepository.create(createMovieDTO);
    return await this.movieRepository.save(movie);
  }

  async findOneMovie(movieId: number): Promise<MovieEntity> {
    return await this.movieRepository.findOne({ where: { id: movieId } });
  }

  async updateMovie(
    movieId: number,
    updateMovieDTO: UpdateMovieDTO,
  ): Promise<MovieEntity> {
    await this.movieRepository.update(movieId, updateMovieDTO);
    const updatedMovie = await this.findOneMovie(movieId);
    if (updatedMovie) {
      return updatedMovie;
    }
    throw new MovieNotFoundException(movieId);
  }

  async deleteMovie(movieId: number) {
    await this.movieRepository.delete({ id: movieId });
  }
}
