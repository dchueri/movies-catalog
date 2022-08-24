import { BadRequestException, CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../../common/test/TestUtil';
import { UserEntity } from '../entities/user.entity';
import UserNotFoundException from '../exceptions/user-not-found.exception';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        UserService,
        UserEntity,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('When get users', () => {
    it('should be list all user from DB', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.getUsers();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When find one user by Id', () => {
    it('should be find a existing user by id in DB', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findOneUserById(1);
      expect(userFound).toMatchObject(user);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);
      await expect(service.findOneUserById(1000)).rejects.toBeInstanceOf(Error);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('When find one user by userName', () => {
    it('should be find a existing user by userName in DB', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findByUserName(user.userName);
      expect(userFound).toMatchObject(user);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(3);
    });
    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findByUserName('uuu')).rejects.toBeInstanceOf(UserNotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(4);
    });
  });

  describe('When create a user', () => {
    it('should add a user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);
      const savedUser = await service.createUser(user);
      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt add a user because a invalid input', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(null);
      user.userName = '';
      await service.createUser(user).catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e).toMatchObject({
          message: 'You must provide userName and password.',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When update a user', () => {
    it('should update a user', async () => {
      const user = TestUtil.giveMeAValidUser();
      const updatedUser = { name: 'userTest' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.updateUser(1, {
        ...user,
        ...updatedUser,
      });
      expect(resultUser).toMatchObject(resultUser);
      expect(mockRepository.findOne).toBeCalledTimes(5);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('When delete a user', () => {
    it('should delete a existing user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.delete.mockReturnValue({ raw: [], affected: 1 });
      const deletedUser = await service.deleteUser(user.id);
      expect(deletedUser).toBe(true);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('should not delete a inexisting user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.delete.mockReturnValue({ raw: [], affected: 0 });
      await service.deleteUser(user.id).catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
      expect(mockRepository.delete).toBeCalledTimes(2);
    });
  });
});
