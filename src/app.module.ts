import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { User } from './authentication/auth.entity';
import { CalendarModule } from './calender/calender.module';
import { ProfileModule } from './profile/profile.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD','root'),
        database: configService.get<string>('DB_NAME', 'Event Management'),
        entities: [User],
        synchronize: true, 
      }),
    }),
    AuthenticationModule,
    ProfileModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
