import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDTO {
  @ApiProperty({
    example: 'userName'
  })
  @IsString({ each: true })
  userName: string;

  @ApiProperty({
    description: 'Must have 6 digits',
    example: '123456'
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
