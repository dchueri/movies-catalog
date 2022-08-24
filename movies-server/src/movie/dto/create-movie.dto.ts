import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateMovieDTO {
  @ApiProperty({
    example: 'Movie Name'
  })
  @IsString({ each: true })
  name: string;

  @ApiProperty({
    example: 'Action'
  })
  @IsNotEmpty()
  genre: string;
}
