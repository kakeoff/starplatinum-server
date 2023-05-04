import { ApplicationStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class SendApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pubs: ApplicationPub[];

  @IsOptional()
  @IsString()
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsString()
  status: ApplicationStatus;
}

export class ApplicationPub {
  @IsNumber()
  id: number;
  @IsNumber()
  publicationId: number;
  @IsString()
  date: string;
}

export class ChangeApplicationStatusDto {
  @IsString()
  status: ApplicationStatus;
}
