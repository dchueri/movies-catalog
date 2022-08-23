import { MovieEntity } from '../../movie/entities/movie.entity';

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
}
