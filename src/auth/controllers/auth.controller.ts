import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response
} from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import UserNotFoundException from 'src/user/exceptions/user-not-found.exception';
import { UserService } from 'src/user/services/user.service';
import { IsPublic } from '../decorators/IsPublic.decorators';
import { AuthRequest } from '../models/AuthRequest.model';
import { UserToken } from '../models/UserToken.model';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('sigin')
  async login(
    @Request() req: AuthRequest,
    @Response() res,
  ): Promise<UserToken> {
    const user = req.body;
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
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async create(
    @Body() userToCreate: CreateUserDTO,
    @Response() res,
  ): Promise<UserEntity> {
    try {
      return await this.userService.createUser(userToCreate);
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
}
