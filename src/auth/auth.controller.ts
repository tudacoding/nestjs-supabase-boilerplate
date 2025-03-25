import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async signInWithGoogle(@Res() res: Response) {
    const { url } = await this.authService.signInWithGoogle();
    res.redirect(url);
  }

  @Get('github')
  async signInWithGithub() {
    return this.authService.signInWithGithub();
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    return await this.authService.handleGoogleCallback(code);
  }

  @Get('signout')
  async signOut() {
    return await this.authService.signOut();
  }

  @Get('me')
  async getCurrentUser() {
    return this.authService.getUser();
  }
}
