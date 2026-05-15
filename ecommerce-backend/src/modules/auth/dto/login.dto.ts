import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'admin@123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}