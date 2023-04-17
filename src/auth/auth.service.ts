import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateAdmin(login: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: 1 },
    });
    if (!admin) {
      throw new UnauthorizedException('User does not exists');
    }
    if (admin.login !== login) {
      throw new ForbiddenException('User does not exists');
    }
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    const payload = { username: admin.login, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
