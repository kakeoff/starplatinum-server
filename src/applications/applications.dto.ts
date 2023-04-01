import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class SendApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pubs: string;

  @IsOptional()
  @IsString()
  comment: string;
}
