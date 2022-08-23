import { InternalServerErrorException } from '@nestjs/common';

class MovieAlreadyExistsErrorException extends InternalServerErrorException {
  constructor(movieName: string) {
    super(`The movie ${movieName} already exists.`);
  }
}

export default MovieAlreadyExistsErrorException;
