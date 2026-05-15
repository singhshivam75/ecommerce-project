import {
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  mobile?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}