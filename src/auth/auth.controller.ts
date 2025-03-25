import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async signInWithGoogle() {
    const { url } = await this.authService.signInWithGoogle();
    return { url };
  }

  @Get('github')
  async signInWithGithub() {
    return this.authService.signInWithGithub();
  }

  @Get('signout')
  async signOut() {
    return await this.authService.signOut();
  }

  @Get('me')
  async getCurrentUser() {
    return this.authService.getUser();
  }

  @Post('verify')
  async verifyTokens(
    @Body()
    params: {
      access_token: string;
      refresh_token: string;
      provider_token: string;
    },
  ) {
    return this.authService.verifyGoogleToken(params);
  }
}
