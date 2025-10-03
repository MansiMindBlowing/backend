import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);

    return {
      success: true,
      message: 'User registered successfully',
      data: user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // We'll add JWT token generation in next step
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user.toJSON();

    return {
      success: true,
      message: 'Login successful',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: userWithoutPassword,
    };
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return {
      success: true,
      data: users,
    };
  }
}
