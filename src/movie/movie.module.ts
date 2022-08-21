import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from './controllers/movie.controller';
import { MovieEntity } from './entities/movie.entity';
import { MovieService } from './services/movie.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
