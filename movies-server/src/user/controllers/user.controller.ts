import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Response,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<UserEntity[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getOneUser(
    @Param('id') userId: number,
    @Response() res,
  ): Promise<UserEntity> {
    try {
      const userFound = await this.userService.findOne(userId);
      return res.status(HttpStatus.OK).json(userFound);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') userId: number,
    @Body() userToUpdate: UpdateUserDTO,
    @Response() res,
  ): Promise<UserEntity> {
    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        userToUpdate,
      );
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') userId: number, @Response() res) {
    try {
      await this.userService.deleteUser(userId);
      return res.status(HttpStatus.NO_CONTENT).json();
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
