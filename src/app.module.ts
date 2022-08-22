import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/services/redis.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [process.env.TYPEORM_ENTITIES],
      migrations: [process.env.TYPEORM_MIGRATIONS],
      migrationsTableName: process.env.TYPEORM_MIGRATIONS_DIR,
      synchronize: true,
      //ssl: { rejectUnauthorized: false },
    }),
    UserModule,
    AuthModule,
    MovieModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
