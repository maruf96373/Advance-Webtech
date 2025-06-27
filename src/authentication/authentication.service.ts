import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../authentication/auth.entity';
import { RegisterDto } from './DTO/registar.dto';  // Fixed typo 'registar.dto' to 'register.dto'
import { LoginDto } from './DTO/login.dto';
import { ForgotDto } from './DTO/forgot.dto';
import { ResetDto } from './DTO/reset.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  // Register a new user
  async register(dto: RegisterDto): Promise<any> {
    const existingEmail = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingEmail) throw new BadRequestException('Email already exists');
  
    const existingUsername = await this.userRepo.findOne({ where: { username: dto.username } });
    if (existingUsername) throw new BadRequestException('Username already exists');
  
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    await this.userRepo.save(user);
  
    // ✅ Send registration success email
    await this.mailService.sendRegistrationSuccess(user.email, user.name);
  
    return {
      message: 'Registration successful',
    };
  }
  
  

  // Login user
  async login(dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }
  
    const identifier = dto.email.toLowerCase();
  
    // ✅ Admin login shortcut
    if (identifier === 'admin@gmail.com' && dto.password === 'Admin@123') {
      const payload = { sub: 'admin-id', email: identifier, role: 'admin' };
      const token = await this.jwtService.signAsync(payload);
  
      return {
        access_token: token,
        role: 'admin',
        message: 'Admin login successful',
      };
    }
  
    // 🔍 Normal user login
    const user = await this.userRepo.findOne({
      where: [
        { email: identifier },
        { username: identifier },
      ],
    });
  
    if (!user) throw new UnauthorizedException('Invalid credentials');
  
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
  
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
  
    return {
      access_token: token,
      role: user.role,
      message: `${user.role} login successful`,
    };
  }
  
  // Forgot password
  async forgotPassword(dto: ForgotDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User with this email not found');

    // Generate reset token
    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '15m' });

    // Send password reset link via email
    await this.mailService.sendPasswordReset(user.email, token);
  
    return { message: 'Password reset link has been sent to your email.' };
  }

  // Reset password
  async resetPassword(dto: ResetDto) {


    let payload: any;
    try {
      // Verify token
      payload = await this.jwtService.verifyAsync(dto.token);
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new NotFoundException('User not found');
  
    // Hash new password and update the user record
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);
  
    // Send password reset success email
    await this.mailService.sendPasswordResetSuccess(user.email, user.name);
  
    return { message: 'Password reset successfully. A confirmation email has been sent.' };
  }
}
