import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(dto.login, dto.password);
  }

  @Post('register')
  async register(@Body() dto: LoginDto): Promise<{ message: string }> {
    return this.authService.register(dto.login, dto.password);
  }
}
