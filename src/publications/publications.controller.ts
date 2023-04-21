import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePublicationDto } from './publications.dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private publications: PublicationsService) {}

  @Get()
  getPublications() {
    return this.publications.getAllPublications();
  }

  @Post()
  sendApplication(@Body() dto: CreatePublicationDto) {
    return this.publications.createPublication(dto);
  }

  @Delete(':applicationId')
  deleteApplication(@Param('applicationId') id: number) {
    return this.publications.deletePublication(id);
  }
}
