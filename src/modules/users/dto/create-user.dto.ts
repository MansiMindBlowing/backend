import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail({}, { message: 'Please provide a valid email address' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'Password is required' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEnum(['admin', 'user', 'viewer'], { message: 'Role must be admin, user, or viewer' })
  @IsOptional()
  role?: string;
}