import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/user/admin.guard';
import { CreatePublicationDto, UpdatePublicationDto } from './publications.dto';
import { PublicationsService } from './publications.service';
@Controller('publications')
export class PublicationsController {
  constructor(private publications: PublicationsService) {}

  @Get()
  getPublications() {
    return this.publications.getAllPublications();
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  sendPublication(@Body() dto: CreatePublicationDto) {
    return this.publications.createPublication(dto);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id')
  updatePublication(@Body() dto: UpdatePublicationDto) {
    return this.publications.updatePublication(dto);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  deletePublication(@Param('id') id: number) {
    return this.publications.deletePublication(id);
  }
}
