import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/user.decorator';
import { UserInfo } from 'src/types';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getUserInfo(@GetUser() user: UserInfo): Promise<UserInfo> {
    return this.userService.getUserInfo(user.id);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async getAllUsers(): Promise<UserInfo[]> {
    return this.userService.getAllUsers();
  }

  @Patch()
  @UseGuards(AuthGuard, AdminGuard)
  async updateUser(@Body() dto: UpdateUserDto): Promise<UserInfo> {
    return this.userService.updateUser(dto);
  }
}
