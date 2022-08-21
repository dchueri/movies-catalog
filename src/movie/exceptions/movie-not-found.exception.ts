import { NotFoundException } from '@nestjs/common';

class MovieNotFoundException extends NotFoundException {
  constructor(movieName: number) {
    super(`Movie with id '${movieName}' not found`);
  }
}

export default MovieNotFoundException;
