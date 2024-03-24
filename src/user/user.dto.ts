import { IsEmail, IsOptional, IsString } from 'class-validator';

export type UpdateUserRoleDto = {
  id: number;
  role: number;
};

export class UpdateMeDto {
  @IsOptional()
  @IsString()
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
