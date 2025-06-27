// src/calendar/dto/create-calendar.dto.ts
import { IsDateString, IsIn, IsNotEmpty } from 'class-validator';

export class CreateCalendarDto {
  @IsDateString({}, { message: 'Date must be in valid' })
  @IsNotEmpty()
  date: string;

  @IsIn(['booked', 'available'], { message: 'Status must be either "booked" or "available"' })
  @IsNotEmpty()
  status: 'booked' | 'available';
}
