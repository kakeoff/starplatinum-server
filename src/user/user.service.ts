import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CartItem, User, UserRole } from 'src/types';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddItemToUserCartDto,
  UpdateMeDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private userFields = {
    id: true,
    login: true,
    role: true,
    createdAt: true,
    avatarUrl: true,
    email: true,
    fullName: true,
    phone: true,
    companyName: true,
    address: true,
    lastVisitDate: true,
  };

  async getUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.userFields,
    });
    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async updateMe(userId: number, data: UpdateMeDto): Promise<User> {
    if (data.login) {
      data.login = data.login.replaceAll(' ', '_');
    }
    const user = await this.prisma.user.update({
      where: { id: userId },
      select: this.userFields,
      data,
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async changePassword(
    userId: number,
    data: UpdateUserPasswordDto,
  ): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (data.old === data.new) {
      throw new ForbiddenException('Passwords are the same');
    }
    const passwordValid = await bcrypt.compare(data.old, user.password);
    if (!passwordValid) {
      throw new ForbiddenException('Incorrect old password');
    }
    const passwordHash = await bcrypt.hash(data.new, 10);

    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: passwordHash,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
    return 'password changed';
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: this.userFields,
    });
    return users;
  }

  async getAllAdmins(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole.admin,
      },
      select: this.userFields,
    });
    return users;
  }

  async updateUserRole(data: UpdateUserRoleDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: data.id },
      select: this.userFields,
      data,
    });

    await this.prisma.application.updateMany({
      where: {
        responsibleId: user.id,
      },
      data: {
        responsibleId: null,
      },
    });

    return user;
  }

  async getUserCart(userId: number): Promise<CartItem[]> {
    const cartItems = await this.prisma.cart.findMany({
      where: {
        userId,
      },
    });
    return cartItems;
  }

  async addItemToCart(
    userId: number,
    dto: AddItemToUserCartDto,
  ): Promise<CartItem> {
    const cartItem = await this.prisma.cart.create({
      data: {
        itemId: dto.itemId,
        type: dto.type,
        itemDate: dto.itemDate,
        userId,
      },
    });
    return cartItem;
  }

  async deleteCartItem(userId: number, id: number): Promise<{ id: number }> {
    const cartItem = await this.prisma.cart.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!cartItem) throw new ForbiddenException('no access');

    await this.prisma.cart.delete({
      where: {
        id: cartItem.id,
      },
    });
    return { id: cartItem.id };
  }

  async clearUserCart(userId: number): Promise<void> {
    await this.prisma.cart.deleteMany({
      where: {
        userId,
      },
    });
  }
}
