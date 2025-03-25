import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signInWithGoogle() {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${process.env.SUPABASE_URL}/auth/v1/callback`,
          },
        });

      if (error) throw new UnauthorizedException(error.message);
      return { url: data.url };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Failed to initiate Google sign in');
    }
  }

  async handleGoogleCallback(code: string) {
    try {
      if (!code) {
        throw new BadRequestException('Authorization code is required');
      }

      const { data, error } =
        await this.supabaseService.client.auth.exchangeCodeForSession(code);

      if (error) throw new UnauthorizedException(error.message);

      return {
        user: data.user,
        session: data.session,
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to handle callback');
    }
  }

  async signInWithGithub() {
    const { data, error } =
      await this.supabaseService.client.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${process.env.APP_URL}/auth/callback`,
        },
      });

    if (error) throw error;
    return data;
  }

  async signOut() {
    try {
      const { error } = await this.supabaseService.client.auth.signOut();
      if (error) throw new UnauthorizedException(error.message);
      return { message: 'Successfully signed out' };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async getUser() {
    try {
      const {
        data: { user },
        error,
      } = await this.supabaseService.client.auth.getUser();

      if (error) throw new UnauthorizedException(error.message);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Failed to get user');
    }
  }
}
