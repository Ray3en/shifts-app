import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { loginSchema, type CurrentUserResponse, type LoginInput, type LoginResponse } from '@mono/shared';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard, type AuthenticatedRequest } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body({ schema: loginSchema }) input: LoginInput): Promise<LoginResponse> {
    return this.auth.login(input);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest): CurrentUserResponse {
    return { data: request.user };
  }
}
