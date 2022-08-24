import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMovieDTO {
  @ApiProperty({
    example: 1
  })
  id?: number;
  @ApiProperty({
    example: 'Movie Name'
  })
  @IsString()
  name: string;
  @ApiProperty({
    example: 'Action'
  })
  @IsString()
  genre: string;
}
