import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import UserAlreadyExistsException from '../exceptions/user-already-exists';
import UserNotFoundException from '../exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    if (createUserDTO.userName && createUserDTO.password) {
      const user = this.usersRepository.create(createUserDTO);
      if (user) {
        user.password = await this.hashPassword(createUserDTO.password);
        try {
          return await this.usersRepository.save(user);
        } catch {
          throw new UserAlreadyExistsException(createUserDTO.userName);
        }
      }
    }
    throw new BadRequestException('You must provide userName and password.');
  }

  async updateUser(updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
    await this.usersRepository.update(updateUserDTO.id, updateUserDTO);
    const updatedUser = await this.usersRepository.findOne({
      where: { id: updateUserDTO.id },
    });
    if (updatedUser) {
      return updatedUser;
    }
    throw new UserNotFoundException(updateUserDTO.userName);
  }

  async deleteUser(userId: number) {
    return await this.usersRepository.delete({ id: userId });
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async findOne(id: number): Promise<UserEntity> {
    return await this.usersRepository.findOne({
      where: { id: id },
      select: ['id', 'userName', 'createdAt', 'updatedAt'],
    });
  }

  async findByUserName(userName: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({
      where: { userName: userName },
    });
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.find({
      select: ['id', 'userName', 'createdAt', 'updatedAt'],
    });
  }
}
