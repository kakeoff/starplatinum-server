import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInfo } from 'src/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(
    login: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    const payload = { userId: user.id };
    try {
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
      };
    } catch (err) {
      throw new Error('Auth error');
    }
  }

  async register(
    login: string,
    password: string,
  ): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        login: login,
        password: passwordHash,
      },
    });

    return { message: 'User registered successfully' };
  }

  async getUserInfo(userId: number): Promise<UserInfo | null> {
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
    return user
      ? {
          id: user.id,
          login: user.login,
          role: user.role,
        }
      : null;
  }
}
