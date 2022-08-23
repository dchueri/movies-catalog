import { NotFoundException } from '@nestjs/common';

class MovieNotFoundException extends NotFoundException {
  constructor(movieId: number) {
    super(`Movie with id '${movieId}' not found`);
  }
}

export default MovieNotFoundException;
