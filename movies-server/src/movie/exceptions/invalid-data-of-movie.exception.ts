import { InternalServerErrorException } from '@nestjs/common';

class InvalidMovieErrorException extends InternalServerErrorException {
  constructor() {
    super('The movie have invalids informations. Try again.');
  }
}

export default InvalidMovieErrorException;
