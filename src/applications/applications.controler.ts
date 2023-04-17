import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SendApplicationDto } from './applications.dto';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private applications: ApplicationsService) {}

  @Get()
  getApplications() {
    return this.applications.getAllApplications();
  }

  @Post()
  sendApplication(@Body() dto: SendApplicationDto) {
    return this.applications.sendApplication(dto);
  }

  @Delete(':applicationId')
  deleteApplication(@Param('applicationId') applicationId: number) {
    return this.applications.deleteApplication(applicationId);
  }
}
