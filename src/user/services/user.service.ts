import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import UserNotFoundException from '../exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const user = this.usersRepository.create(createUserDTO);
    user.password = await this.hashPassword(createUserDTO.password);

    return await this.usersRepository.save(user);
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

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async findOne(id: number): Promise<UserEntity> {
    return await this.usersRepository.findOneOrFail({ where: { id: id } });
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
