import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/user.decorator';
import { User, UserInfo } from 'src/types';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import {
  UpdateMeDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@GetUser() user: UserInfo): Promise<User> {
    return this.userService.getMe(user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMe(
    @GetUser() user: UserInfo,
    @Body() dto: UpdateMeDto,
  ): Promise<User> {
    const data = { ...dto };
    for (const key in data) {
      if (data[key] === '') {
        data[key] = null;
      }
    }

    return this.userService.updateMe(user.id, data);
  }

  @Patch('password')
  @UseGuards(AuthGuard)
  async changePassword(
    @GetUser() user: UserInfo,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<string> {
    return this.userService.changePassword(user.id, dto);
  }

  @Get('all')
  @UseGuards(AuthGuard, AdminGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Patch('role')
  @UseGuards(AuthGuard, AdminGuard)
  async updateUserRole(@Body() dto: UpdateUserRoleDto): Promise<User> {
    return this.userService.updateUserRole(dto);
  }
}
