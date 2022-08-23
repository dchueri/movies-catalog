import { InternalServerErrorException } from '@nestjs/common';

class UserInternalServerErrorException extends InternalServerErrorException {
  constructor(userName: string) {
    super('Oh no :( error at a user: ' + userName);
  }
}

export default UserInternalServerErrorException;
