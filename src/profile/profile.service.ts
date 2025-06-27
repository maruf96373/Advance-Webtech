import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../authentication/auth.entity';
import { UpdateProfileDto } from './DTO/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // Fetch user profile data
  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'username', 'dob', 'profilePic'],
    });

    if (!user) throw new BadRequestException('User not found');

    return {
      ...user,
      profilePic: user.profilePic
        ? `/uploads/profile-pics/${user.profilePic}`
        : null,
    };
  }

  // Update profile fields
  async updateProfile(userId: string, body: UpdateProfileDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('User not found');

    const { name, email, username, dob } = body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (username !== undefined) user.username = username;
    if (dob !== undefined) user.dob = dob;

    await this.userRepo.save(user);

    return { message: 'Profile updated successfully' };
  }

  // Update profile picture
  async updateProfilePicture(userId: string, filename: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('User not found');

    user.profilePic = filename;
    await this.userRepo.save(user);

    return {
      message: 'Profile picture updated successfully',
      profilePic: `/uploads/profile-pics/${filename}`,
    };
  }
}
