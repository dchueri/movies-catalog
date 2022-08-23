import { NotFoundException } from '@nestjs/common';

class UserNotFoundException extends NotFoundException {
  constructor(userName: string) {
    super(`User with username ${userName} not found`);
  }
}

export default UserNotFoundException;
