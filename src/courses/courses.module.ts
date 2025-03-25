import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [ConfigModule, SupabaseModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
