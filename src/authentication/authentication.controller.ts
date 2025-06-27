import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './authentication.service';
import { RegisterDto } from './DTO/registar.dto';
import { LoginDto } from './DTO/login.dto';
import { ForgotDto } from './DTO/forgot.dto';
import { ResetDto } from './DTO/reset.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { DEFAULT_ROLES } from './constants/auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.AuthService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.AuthService.login(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotDto) {
    return this.AuthService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetDto) {
    return this.AuthService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('home')
  getHome(@Req() req: Request) {
    const user = req.user!;
    // You can also add a runtime check if needed:
    // if (!user) throw new UnauthorizedException();

    if (user.role === 'admin') {
      return { message: 'Welcome admin' };
    } else if (user.role === 'attendee') {
      return { message: `Welcome ${user.name}` };
    }
    return { message: 'Login successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'Logout successful' });
  }
}
