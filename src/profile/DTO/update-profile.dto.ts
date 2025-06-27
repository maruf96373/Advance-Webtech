import {
    IsString,
    IsOptional,
    IsEmail,
    Length,
    Matches,
    IsDateString,
    IsNotEmpty,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  // ✅ Custom validator for full name
  @ValidatorConstraint({ name: 'FullName', async: false })
  class FullNameValidator implements ValidatorConstraintInterface {
    validate(name: string) {
      return name.trim().split(' ').length >= 2;
    }
  
    defaultMessage() {
      return 'Full name must contain at least 2 words';
    }
  }
  
  // ✅ Custom validator for age range
  @ValidatorConstraint({ name: 'AgeRangeValidator', async: false })
  class AgeRangeValidator implements ValidatorConstraintInterface {
    validate(dob: string) {
      const birthDate = new Date(dob);
      const today = new Date();
  
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      const isBeforeBirthday =
        m < 0 || (m === 0 && today.getDate() < birthDate.getDate());
  
      const actualAge = isBeforeBirthday ? age - 1 : age;
  
      return actualAge >= 14 && actualAge <= 70;
    }
  
    defaultMessage() {
      return 'Age must be between 14 and 70 years';
    }
  }
  
  // ✅ Main DTO
  export class UpdateProfileDto {
    @IsOptional()
    @IsNotEmpty()
    @Validate(FullNameValidator)
    name?: string;
  
    @IsOptional()
    @IsNotEmpty({ message: 'Email is required' })
    @Matches(/^[a-z0-9]+@(gmail|yahoo)\.com$/, {
      message:
        'Email must start with lowercase letters or digits and end with @gmail.com or @yahoo.com',
    })
    email?: string;
  
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9_]+$/, {
      message: 'Username must contain only letters, numbers, and underscores',
    })
    @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
    username?: string;
  
    @IsOptional()
    @IsDateString({}, { message: 'DOB must be a valid date (YYYY-MM-DD)' })
    @Validate(AgeRangeValidator)
    dob?: string;
  
    // ✅ Picture validation (for filename/path string, not the file itself)
    @IsOptional()
    @IsString()
    @Matches(/\.(jpg|jpeg|png|webp)$/i, {
      message: 'Picture must be a valid image file (jpg, jpeg, png, webp)',
    })
    picture?: string;
  }
  