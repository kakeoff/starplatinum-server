import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreatePublicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;
}
