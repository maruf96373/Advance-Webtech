import {
    IsNotEmpty,
    IsEmail,
    MinLength,
    Matches,
    IsDateString,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface
  } from 'class-validator';
  
 
  @ValidatorConstraint({ name: 'FullName', async: false })
  class FullNameValidator implements ValidatorConstraintInterface {
    validate(name: string) {
      return name.trim().split(' ').length >= 2;
    }
  
    defaultMessage() {
      return 'Full name must contain at least 2 words';
    }
  }
  

  @ValidatorConstraint({ name: 'AgeRangeValidator', async: false })
  class AgeRangeValidator implements ValidatorConstraintInterface {
    validate(dob: string) {
      const birthDate = new Date(dob);
      const today = new Date();
  
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      const isBeforeBirthday = m < 0 || (m === 0 && today.getDate() < birthDate.getDate());
  
      const actualAge = isBeforeBirthday ? age - 1 : age;
  
      return actualAge >= 14 && actualAge <= 70;
    }
  
    defaultMessage() {
      return 'Age must be between 14 and 70 years';
    }
  }
  
  export class RegisterDto {
    @IsNotEmpty()
    @Validate(FullNameValidator)
    name: string;
  
    @IsEmail()
    //@IsNotEmpty({ message: 'Email is required' })
  //@Matches(/^[a-z0-9]+@(gmail|yahoo)\.com$/, {
      email: string;
  
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, {
      message: 'Password must include at least one letter and one number',
    })
    password: string;
  
    @IsNotEmpty({ message: 'Confirm password is required' })
    confirmPassword: string;

    @IsNotEmpty({ message: 'Confirm password is required' })
    username: string;
  
    @IsDateString({}, { message: 'DOB must be a valid date (YYYY-MM-DD)' })
    @Validate(AgeRangeValidator)
    dob: string;
  }
  