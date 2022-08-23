import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RedisService } from 'src/redis/services/redis.service';
import { CreateMovieDTO } from '../dto/create-movie.dto';
import { UpdateMovieDTO } from '../dto/update-movie.dto';
import { MovieEntity } from '../entities/movie.entity';
import { MovieService } from '../services/movie.service';

@Controller('movie')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly redisService: RedisService,
  ) {}

  @Get('all')
  async getMovies(): Promise<MovieEntity[]> {
    return await this.movieService.findAllMovies();
  }

  @Post('add')
  async addMovie(@Body() createMovieDTO: CreateMovieDTO): Promise<MovieEntity> {
    return await this.movieService.addMovie(createMovieDTO);
  }

  @Get(':id')
  async getOneMovie(@Param('id') movieId: number): Promise<MovieEntity> {
    return await this.movieService.findOneMovie(movieId);
  }

  @Put('update/:id')
  async updateMovie(
    @Param('id') movieId: number,
    @Body() updateMovie: UpdateMovieDTO,
  ): Promise<UpdateMovieDTO> {
    return await this.movieService.updateMovie(movieId, updateMovie);
  }

  @Delete('delete/:id')
  async deleteMovie(@Param('id') movieId: number) {
    return await this.movieService.deleteMovie(movieId);
  }
}
