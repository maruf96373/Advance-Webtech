import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class LoginDto {
   @IsNotEmpty({ message: 'Email is required' })
    @Matches(/^[a-z0-9]+@(gmail|yahoo)\.com$/, {
      message:
        'Email must start with lowercase letters or digits and end with @gmail.com or @yahoo.com',
    })
    email: string;
    

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
