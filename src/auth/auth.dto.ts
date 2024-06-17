import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(5)
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @MinLength(6)
  password: string;
}
