import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({
    example: 1
  })
  @IsNumber()
  id: number;
  @ApiProperty({
    example: 'userName'
  })
  @IsString()
  userName: string;
  @ApiProperty({
    description: 'Must have at least 6 digits',
    example: '123456'
  })
  @IsString()
  password?: string;
}
