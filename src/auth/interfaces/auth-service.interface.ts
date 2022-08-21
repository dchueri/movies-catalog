import { UserEntity } from 'src/user/entities/user.entity';

export interface IAuthService {
  validateUser(userName: string, password: string): Promise<UserEntity | null>;
}
