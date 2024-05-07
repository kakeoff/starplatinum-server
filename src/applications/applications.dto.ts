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
  date: string;
}

export class ChangeApplicationStatusDto {
  @IsString()
  status: ApplicationStatus;
}
