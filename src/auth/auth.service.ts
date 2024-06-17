import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(
    login: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            login: login,
          },
          {
            email: login,
          },
        ],
      },
    });
    if (!user) {
      throw new ForbiddenException('User does not exists');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new ForbiddenException('Incorrect password');
    }
    const payload = {
      id: user.id,
      login: user.login,
      role: user.role,
      email: user.email,
    };
    try {
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
      };
    } catch (err) {
      throw new Error('Auth error');
    }
  }

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            login: dto.login,
          },
          {
            email: dto.email,
          },
        ],
      },
    });

    if (existingUser) {
      throw new ForbiddenException('User already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: passwordHash,
      },
    });

    const payload = {
      id: user.id,
      login: user.login,
      role: user.role,
      email: user.email,
    };

    try {
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
      };
    } catch (err) {
      throw new Error('Auth error');
    }
  }
}
