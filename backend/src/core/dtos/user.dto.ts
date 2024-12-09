import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName?: string;
}

export class UserSigninDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
