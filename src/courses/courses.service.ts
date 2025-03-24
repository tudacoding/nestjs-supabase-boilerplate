import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Course } from './interfaces/course.interface';

@Injectable()
export class CoursesService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await this.supabaseService.client
      .from('courses')
      .select('*');

    if (error) {
      throw error;
    }

    return data as Course[];
  }
}
