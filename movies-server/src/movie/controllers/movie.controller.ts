import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Response,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RedisService } from '../../redis/services/redis.service';
import { CreateMovieDTO } from '../dto/create-movie.dto';
import { UpdateMovieDTO } from '../dto/update-movie.dto';
import { MovieEntity } from '../entities/movie.entity';
import { MovieService } from '../services/movie.service';

@ApiTags('movie')
@Controller('movie')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly redisService: RedisService,
  ) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getMovies(): Promise<MovieEntity[]> {
    return await this.movieService.findAllMovies();
  }

  @Post('add')
  async addMovie(
    @Body() createMovieDTO: CreateMovieDTO,
    @Response() res,
  ): Promise<MovieEntity> {
    try {
      const addedMovie = await this.movieService.addMovie(createMovieDTO);
      return res.status(HttpStatus.CREATED).json(addedMovie);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Get(':id')
  async getOneMovie(
    @Param('id') movieId: number,
    @Response() res,
  ): Promise<MovieEntity> {
    try {
      const movieFound = await this.movieService.findOneMovie(movieId);
      return res.status(HttpStatus.OK).json(movieFound);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Put('update/:id')
  async updateMovie(
    @Param('id') movieId: number,
    @Body() updateMovie: UpdateMovieDTO,
    @Response() res,
  ): Promise<UpdateMovieDTO> {
    try {
      const updatedMovie = await this.movieService.updateMovie(
        movieId,
        updateMovie,
      );
      return res.status(HttpStatus.OK).json(updatedMovie);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Delete('delete/:id')
  async deleteMovie(@Param('id') movieId: number, @Response() res) {
    try {
      await this.movieService.deleteMovie(movieId);
      return res.status(HttpStatus.NO_CONTENT).json();
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
