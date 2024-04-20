import { ApplicationStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class SendApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ApplicationPub)
  pubs: ApplicationPub[];

  @IsOptional()
  @IsString()
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;
}

export class ApplicationPub {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsString()
  date: string;
}

export class ChangeApplicationStatusDto {
  @IsString()
  status: ApplicationStatus;
}
