// src/calendar/calendar.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calender.service';
import { CalendarController } from './calender.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar])],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
