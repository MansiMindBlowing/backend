import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail({}, { message: 'Please provide a valid email address' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
