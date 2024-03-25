import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserRoleDto {
  @IsNumber()
  id: number;

  @IsNumber()
  role: number;
}

export class UpdateUserPasswordDto {
  @IsString()
  old: string;

  @IsString()
  @MinLength(6)
  new: string;
}

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  login?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  fullName?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  companyName?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;
}
