import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
  } from 'typeorm';
  
  @Entity('users')
  @Unique(['email'])
  @Unique(['username'])
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    username: string;
  
    @Column()
    email: string;
  
    @Column()
    password: string;
  
    @Column({ type: 'date' })
    dob: string;
  
    @Column({ default: 'attendee' }) // 'user' or 'admin'
  role: 'attendee' | 'admin';
  
    @Column({ nullable: true })
    profilePic?: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  