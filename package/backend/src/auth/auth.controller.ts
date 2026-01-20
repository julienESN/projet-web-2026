import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  LoginDtoSchema,
  RegisterDtoSchema,
  AuthResponseSchema,
  UserProfileSchema,
} from 'contracts';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import assert from 'node:assert';
import { th } from 'zod/locales';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const parsedLoginDto = LoginDtoSchema.parse(loginDto);

    assert(parsedLoginDto, new Error('Invalid login data'));

    const data = this.authService.login(parsedLoginDto);
    assert(data, new Error('Login failed'));

    const parsedAuthResponse = AuthResponseSchema.parse(data);
    assert(parsedAuthResponse, new Error('Invalid auth response data'));

    return parsedAuthResponse;
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    const parsedRegisterDto = RegisterDtoSchema.parse(registerDto);

    assert(parsedRegisterDto, new Error('Invalid register data'));

    const data = this.authService.register(parsedRegisterDto);
    assert(data, new Error('Registration failed'));

    const parsedAuthResponse = AuthResponseSchema.parse(data);
    assert(parsedAuthResponse, new Error('Invalid auth response data'));

    return parsedAuthResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: { userId: string; email: string }) {
    const data = this.authService.getMe(user.userId);
    assert(data, new Error('User not found'));

    const parsedUserProfile = UserProfileSchema.parse(data);
    assert(parsedUserProfile, new Error('Invalid user profile data'));

    return parsedUserProfile;
  }
}
