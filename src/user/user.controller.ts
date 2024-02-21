import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/user.decorator';
import { UserInfo } from 'src/types';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getUserInfo(@GetUser() user: UserInfo): Promise<UserInfo> {
    console.log(user);
    return this.userService.getUserInfo(user.id);
  }
}
