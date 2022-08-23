import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import UserInternalServerErrorException from '../exceptions/user-internal-server-error.exception';
import UserNotFoundException from '../exceptions/user-not-found.exception';
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getUsers(): Promise<UserEntity[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getOneUser(@Param('id') userId: number): Promise<UserEntity> {
    return await this.userService.findOne(userId);
  }

  @Put()
  async updateUser(@Body() userToUpdate: UpdateUserDTO): Promise<UserEntity> {
    try {
      return await this.userService.updateUser(userToUpdate);
    } catch {
      throw new UserInternalServerErrorException(userToUpdate.userName);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: number) {
    try {
      return await this.userService.deleteUser(userId);
    } catch {
      throw new UserNotFoundException('');
    }
  }
}
