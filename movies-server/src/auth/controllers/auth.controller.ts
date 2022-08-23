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
  @Post('signin')
  async login(
    @Request() req: AuthRequest,
    @Response() res,
  ): Promise<UserToken> {
    const user = req.body;
    try {
      const jwt = await this.authService.login(user);
      return res.status(HttpStatus.OK).json(jwt);
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
      const createdUser = await this.userService.createUser(userToCreate);
      return res.status(HttpStatus.CREATED).json(createdUser);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
