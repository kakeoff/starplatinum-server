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
import { GetUser } from 'src/auth/user.decorator';
import { CartItem, User, UserInfo } from 'src/types';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import {
  AddItemToUserCartDto,
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
    return this.userService.getUser(user.id);
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

  @Get('all-admins')
  @UseGuards(AuthGuard)
  async getAllAdmins(): Promise<User[]> {
    return this.userService.getAllAdmins();
  }

  @Patch('role')
  @UseGuards(AuthGuard, AdminGuard)
  async updateUserRole(@Body() dto: UpdateUserRoleDto): Promise<User> {
    return this.userService.updateUserRole(dto);
  }

  @Get('cart')
  @UseGuards(AuthGuard)
  async getUserCart(@GetUser() user: UserInfo): Promise<CartItem[]> {
    return this.userService.getUserCart(user.id);
  }

  @Post('cart')
  @UseGuards(AuthGuard)
  async addItemToCart(
    @GetUser() user: UserInfo,
    @Body() dto: AddItemToUserCartDto,
  ): Promise<CartItem> {
    return this.userService.addItemToCart(user.id, dto);
  }

  @Delete('cart/:id')
  @UseGuards(AuthGuard)
  async deleteCartItem(
    @GetUser() user: UserInfo,
    @Param('id') id: string,
  ): Promise<{ id: number }> {
    return this.userService.deleteCartItem(user.id, Number(id));
  }

  @Patch('cart-clear')
  @UseGuards(AuthGuard)
  async clearUserCart(@GetUser() user: UserInfo): Promise<void> {
    return this.userService.clearUserCart(user.id);
  }
}
