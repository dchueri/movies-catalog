import { InternalServerErrorException } from '@nestjs/common';

class UserAlreadyExistsException extends InternalServerErrorException {
  constructor(userName: string) {
    super(`Username ${userName} already exists`);
  }
}

export default UserAlreadyExistsException;
