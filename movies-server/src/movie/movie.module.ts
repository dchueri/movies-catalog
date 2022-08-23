import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/services/redis.service';
import { MovieController } from './controllers/movie.controller';
import { MovieEntity } from './entities/movie.entity';
import { MovieService } from './services/movie.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), RedisModule],
  providers: [MovieService, RedisService],
  controllers: [MovieController],
})
export class MovieModule {}
