import { Injectable, UnauthorizedException } from '@nestjs/common';
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
            redirectTo: `${process.env.CLIENT_APP_URL}/auth/callback`,
          },
        });

      if (error) throw new UnauthorizedException(error.message);
      return { url: data.url };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Failed to initiate Google sign in');
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

  async verifyGoogleToken(params: {
    access_token: string;
    refresh_token: string;
    provider_token: string;
  }) {
    try {
      // Verify access token với Supabase
      const { data: sessionData, error: sessionError } =
        await this.supabaseService.client.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
      if (sessionError) {
        throw new UnauthorizedException(sessionError.message);
      }

      // Verify provider token (Google token)
      const { error: userError } =
        await this.supabaseService.client.auth.getUser(params.access_token);
      if (userError) {
        throw new UnauthorizedException(userError.message);
      }

      return {
        session: sessionData.session,
        isValid: true,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify tokens');
    }
  }
}
