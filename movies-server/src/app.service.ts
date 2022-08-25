import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Object {
    return { message: "Try /auth/signin to login. Or /api for complet documentation." };
  }
}
