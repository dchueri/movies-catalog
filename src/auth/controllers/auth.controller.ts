import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request
} from '@nestjs/common';
import UserNotFoundException from 'src/user/exceptions/user-not-found.exception';
import { IsPublic } from '../decorators/IsPublic.decorators';
import { AuthRequest } from '../models/AuthRequest.model';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  //@UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sigin')
  async login(@Request() req: AuthRequest) {
    const user = req.body;
    console.log(user);
    try {
      const validatedUser = await this.authService.validateUser(
        user.userName,
        user.password,
      );
      const jwt = this.authService.login(validatedUser);
      if (!jwt) {
        throw new UserNotFoundException(validatedUser.userName);
      }
      return jwt;
    } catch (e) {
      return { message: e.message };
    }
  }
}
