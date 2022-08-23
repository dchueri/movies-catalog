import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDTO {
  @IsString({ each: true })
  userName: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
