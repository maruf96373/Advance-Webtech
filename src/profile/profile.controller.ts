import {
    Controller,
    Get,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Body,
    Req,
  } from '@nestjs/common';
  import { ProfileService } from './profile.service';
  import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('profile')
  export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req) {
      return this.profileService.getProfile(req.user.id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateProfile(@Req() req, @Body() body) {
      return this.profileService.updateProfile(req.user.id, body);
    }
  
    @UseGuards(JwtAuthGuard)
    @Put('upload-picture')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/profile-pics',
          filename: (req, file, cb) => {
            const uniqueName =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueName}${extname(file.originalname)}`);
          },
        }),
      }),
    )
    async uploadProfilePicture(@UploadedFile() file, @Req() req) {
      return this.profileService.updateProfilePicture(req.user.id, file.filename);
    }
  }
  