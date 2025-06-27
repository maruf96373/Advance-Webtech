import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { User } from '../authentication/auth.entity'; // adjust path as needed
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]) // 👈 this allows injection of UserRepository
  ],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
