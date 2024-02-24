import { Injectable, NotFoundException } from '@nestjs/common';
import { UserInfo } from 'src/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserInfo(userId: number): Promise<UserInfo> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        login: true,
        role: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAllUsers(): Promise<UserInfo[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        role: true,
      },
    });
    if (!users) throw new NotFoundException('Users not found');
    return users;
  }

  async updateUser(data: UserInfo): Promise<UserInfo> {
    const user = await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data: data,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
