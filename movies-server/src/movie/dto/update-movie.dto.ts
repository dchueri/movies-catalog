import { IsString } from 'class-validator';

export class UpdateMovieDTO {
  id?: number;
  @IsString()
  name: string;
  @IsString()
  genre: string;
}
