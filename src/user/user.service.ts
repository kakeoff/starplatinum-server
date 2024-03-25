import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInfo } from 'src/types';
import { PrismaService } from '../prisma/prisma.service';
import {
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

  private async updateUserLastVisit(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastVisitDate: new Date() },
    });
  }

  async getMe(userId: number): Promise<UserInfo> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.userFields,
    });
    if (!user) throw new NotFoundException('User not found');

    await this.updateUserLastVisit(userId);
    return user;
  }

  async updateMe(userId: number, data: UpdateMeDto): Promise<UserInfo> {
    if (data.login) {
      data.login = data.login.replaceAll(' ', '_');
    }
    const user = await this.prisma.user.update({
      where: { id: userId },
      select: this.userFields,
      data,
    });
    if (!user) throw new NotFoundException('User not found');

    await this.updateUserLastVisit(userId);
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

  async getAllUsers(): Promise<UserInfo[]> {
    const users = await this.prisma.user.findMany({
      select: this.userFields,
    });
    if (users.length === 0) throw new NotFoundException('Users not found');
    return users;
  }

  async updateUserRole(data: UpdateUserRoleDto): Promise<UserInfo> {
    const user = await this.prisma.user.update({
      where: { id: data.id },
      select: this.userFields,
      data,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
