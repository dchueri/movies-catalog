import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import UserAlreadyExistsException from '../exceptions/user-already-exists';

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

  async updateUser(
    userId: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserEntity> {
    if (updateUserDTO.password) {
      updateUserDTO.password = await this.hashPassword(updateUserDTO.password);
    }
    try {
      await this.usersRepository.update(userId, updateUserDTO);
    } catch (e) {
      console.log(e.message);
      throw new UserAlreadyExistsException(updateUserDTO.userName);
    }
    const updatedUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (updatedUser) {
      return updatedUser;
    }
    throw new Error(`User with id ${userId} not found`);
  }

  async deleteUser(userId: number) {
    const returnOfDelete = await this.usersRepository.delete({ id: userId });
    if (returnOfDelete.affected) {
      return;
    }
    throw new Error(`User with id ${userId} not found`);
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async findOne(userId: number): Promise<UserEntity> {
    const userFound = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'userName', 'createdAt', 'updatedAt'],
    });
    if (userFound) {
      return userFound;
    }
    throw new Error(`User with id ${userId} not found`);
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
