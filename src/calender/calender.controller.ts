import {
  Controller,
  UseGuards,
  Post,
  Get,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CalendarService } from './calender.service';
import { CreateCalendarDto } from './DTO/create-calendar.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateCalendarDto) {
    return this.calendarService.createOrUpdateBooking(dto);
  }

  @Get('/all')
  @Roles('admin')
  getAll() {
    return this.calendarService.getAllBookings();
  }

  @Delete('/:date')
  @Roles('admin')
  delete(@Param('date') date: string) {
    return this.calendarService.deleteBooking(date);
  }

  @Get('/available')
  getAvailable() {
    return this.calendarService.getAvailableDates();
  }
}
