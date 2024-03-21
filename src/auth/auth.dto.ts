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
  fullName: string;

  @IsString()
  @IsOptional()
  companyName: string | null;

  @IsString()
  @IsOptional()
  phone: string | null;

  @IsString()
  @IsOptional()
  address: string | null;

  @IsString()
  @MinLength(6)
  password: string;
}
