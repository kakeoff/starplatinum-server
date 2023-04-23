import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePublicationDto, UpdatePublicationDto } from './publications.dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private publications: PublicationsService) {}

  @Get()
  getPublications() {
    return this.publications.getAllPublications();
  }

  @Post()
  sendPublication(@Body() dto: CreatePublicationDto) {
    return this.publications.createPublication(dto);
  }

  @Patch(':id')
  updatePublication(@Body() dto: UpdatePublicationDto) {
    return this.publications.updatePublication(dto);
  }

  @Delete(':id')
  deletePublication(@Param('id') id: number) {
    return this.publications.deletePublication(id);
  }
}
