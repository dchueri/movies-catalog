import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MovieEntity } from 'src/movie/entities/movie.entity';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get(key: string): Promise<MovieEntity[]> {
    return await this.cacheManager.get(key);
  }

  public async set(key: string, value: object) {
    await this.cacheManager.set(key, value);
  }

  public async del(key: any) {
    await this.cacheManager.del(key);
  }
}
