// src/calendar/calendar.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('calendar')
export class Calendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', unique: true })
  date: string; // Only one booking per date

  @Column()
  status: 'booked' | 'available'; // 'booked' or 'available'

}
