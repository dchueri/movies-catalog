import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

  @Put()
  async update(@Body() userToUpdate: UpdateUserDTO): Promise<UserEntity> {
    try {
      return await this.userService.updateUser(userToUpdate);
    } catch {
      throw new UserInternalServerErrorException(userToUpdate.userName);
    }
  }
}
