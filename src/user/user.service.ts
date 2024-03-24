import { Injectable, NotFoundException } from '@nestjs/common';
import { UserInfo } from 'src/types';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMeDto, UpdateUserRoleDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: number): Promise<UserInfo> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
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
      },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastVisitDate: new Date(),
      },
    });
    return user;
  }

  async updateMe(userId: number, data: UpdateMeDto): Promise<UserInfo> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      select: {
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
      },
      data: {
        fullName: data.fullName,
        address: data.address,
        avatarUrl: data.avatarUrl,
        email: data.email,
        companyName: data.companyName,
        login: data.login,
        phone: data.phone,
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
        createdAt: true,
        avatarUrl: true,
        email: true,
        fullName: true,
        phone: true,
        companyName: true,
        address: true,
        lastVisitDate: true,
      },
    });
    if (!users) throw new NotFoundException('Users not found');
    return users;
  }

  async updateUserRole(data: UpdateUserRoleDto): Promise<UserInfo> {
    const user = await this.prisma.user.update({
      where: {
        id: data.id,
      },
      select: {
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
      },
      data: data,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
