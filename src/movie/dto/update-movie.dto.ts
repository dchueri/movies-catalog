import { IsString } from 'class-validator';

export class UpdateMovieDTO {
  @IsString()
  name: string;
  @IsString()
  genre: string;
}
