import { IsNotEmpty, IsString } from 'class-validator';
export class CreateMovieDTO {
  @IsString({ each: true })
  name: string;

  @IsNotEmpty()
  genre: string;
}
