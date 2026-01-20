import { Controller, Get, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';

import { LoginDto, RegisterDto } from 'contracts';

@Controller('auth')
export class AuthController {
  @Get()
  getHello(): string {
    return 'Hello from AuthController';
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): string {
    return `User ${loginDto.username} logged in`;
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto): string {
    return `User ${registerDto.username} registered`;
  }
}
