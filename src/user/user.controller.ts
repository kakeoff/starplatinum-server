import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUserId } from 'src/auth/user.decorator';
import { UserInfo } from 'src/types';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getUserInfo(@GetUserId() userId: number): Promise<UserInfo> {
    return this.userService.getUserInfo(userId);
  }
}
