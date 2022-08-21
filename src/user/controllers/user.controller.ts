import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import UserInternalServerErrorException from '../exceptions/user-internal-server-error.exception';
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserEntity[]> {
    return await this.userService.getUsers();
  }

  @Post('signup')
  async create(@Body() userToCreate: CreateUserDTO): Promise<UserEntity> {
    try {
      return await this.userService.createUser(userToCreate);
    } catch {
      throw new UserInternalServerErrorException(userToCreate.userName);
    }
  }

  @Put()
  async update(@Body() userToUpdate: UpdateUserDTO): Promise<UserEntity> {
    try {
      return await this.userService.updateUser(userToUpdate);
    } catch {
      throw new UserInternalServerErrorException(userToUpdate.userName);
    }
  }
}
