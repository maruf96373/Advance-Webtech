import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetDto {
  @IsNotEmpty({ message: 'Reset token is required' })
  token: string;

  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;

}
