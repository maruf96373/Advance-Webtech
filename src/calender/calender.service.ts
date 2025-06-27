// src/calendar/calendar.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { CreateCalendarDto } from './DTO/create-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar) private calendarRepo: Repository<Calendar>,
  ) {}

  async createOrUpdateBooking(dto: CreateCalendarDto) {
    const { date } = dto;


    let booking = await this.calendarRepo.findOne({ where: { date } });

    if (booking) {
      booking.status = dto.status; 
    } else {
      booking = this.calendarRepo.create(dto); 
    }

    await this.calendarRepo.save(booking);
    return { message: 'Booking status updated successfully' };
  }

  // Get all bookings (Admin)
  async getAllBookings() {
    return this.calendarRepo.find({
      order: { date: 'ASC' },
    });
  }

  // Get all available dates (User)
  async getAvailableDates() {
    return this.calendarRepo.find({
      where: { status: 'available' },
      order: { date: 'ASC' },
    });
  }

  // Delete a booking by date
  async deleteBooking(date: string) {
    const booking = await this.calendarRepo.findOne({ where: { date } });

    if (!booking) throw new BadRequestException('Booking not found for this date');

    await this.calendarRepo.delete(booking.id);
    return { message: 'Booking deleted successfully' };
  }
}
