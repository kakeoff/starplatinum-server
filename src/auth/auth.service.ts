import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {
    super();
  }

  async validateAdmin(login: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: 1 },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    if (admin.login !== login) {
      throw new ForbiddenException('Incorrect login');
    }
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      throw new UnauthorizedException();
    }
    const payload = { username: admin.login, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
