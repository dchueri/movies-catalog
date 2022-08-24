import { MovieEntity } from '../../movie/entities/movie.entity';
import { CreateUserDTO } from '../../user/dto/create-user.dto';
import { UserEntity } from '../../user/entities/user.entity';

export default class TestUtil {
  static giveMeAValidMovie(): MovieEntity {
    const movie = new MovieEntity();
    movie.id = 1;
    movie.name = 'Test movie';
    movie.genre = 'Test genre';
    movie.createdAt = new Date();
    movie.updatedAt = new Date();
    return movie;
  }

  static giveMeAValidUser(): UserEntity {
    const user = new UserEntity();
    user.id = 1;
    user.userName = 'userTest';
    user.password = '123456';
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }

  static giveMeAValidCreateUser(): CreateUserDTO {
    const user = new CreateUserDTO();
    user.userName = 'userTest';
    user.password = '123456';
    return user;
  }
}
