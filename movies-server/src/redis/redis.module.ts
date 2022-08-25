import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './services/redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          user: process.env.REDIS_USER,
          password: process.env.REDIS_PASSWORD,
          ttl: 300,
          //url: 'redis-16179.c83.us-east-1-2.ec2.cloud.redislabs.com:16179',
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [CacheModule, RedisService],
})
export class RedisModule {
  constructor() {}
}
