import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*');

    if (error) {
      throw error;
    }

    return data as User[];
  }
}
