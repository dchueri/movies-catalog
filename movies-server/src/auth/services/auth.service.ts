import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { IAuthService } from '../interfaces/auth-service.interface';
import { UserPayload } from '../models/UserPayload.model';
import { UserToken } from '../models/UserToken.model';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    userName: string,
    password: string,
  ): Promise<UserEntity | null> {
    if (userName && password) {
      const user = await this.usersService.findByUserName(userName);
      if (user) {
        const isValidPassword = await this.comparePassword(
          password,
          user.password,
        );
        if (isValidPassword) {
          return {
            ...user,
            password: '***',
          };
        }
      }
      throw new Error('Username or password provided is incorrect.');
    }
    throw new Error('You must provide userName and password.');
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(user: UserEntity): Promise<UserToken> {
    await this.validateUser(user.userName, user.password);
    const payload: UserPayload = {
      sub: user.id,
      userName: user.userName,
    };

    const jwtToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token: jwtToken,
      userName: user.userName,
      id: user.id,
    };
  }
}
