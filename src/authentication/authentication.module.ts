import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';
import { User } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy'; // ✅ Import the strategy
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ConfigModule, // ✅ Needed for ConfigService
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // ✅ Explicitly set jwt strategy
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // ✅ Register the strategy here
  ],
  exports: [AuthService, JwtStrategy, PassportModule], // ✅ Export the strategy if needed in other modules
})
export class AuthenticationModule {}
