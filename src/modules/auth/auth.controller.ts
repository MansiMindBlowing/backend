import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
// import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../../models/user.model';
import { AuthService } from '../services/auth.service';
import { Req, Res } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);

    return {
      success: true,
      message: result.message,
      data: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    return {
      success: true,
      message: 'Login successful',
      data: result,
    };
  }

  @Get('verify-email')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(verifyEmailDto.token);
    
    return {
      success: true,
      message: result.message,
    };
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() resendDto: ResendVerificationDto) {
    const result = await this.authService.resendVerificationEmail(resendDto.email);
    
    return {
      success: true,
      message: result.message,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    return {
      success: true,
      data: user,
    };
  }

  @Get('google')
@UseGuards(GoogleOAuthGuard)
async googleAuth() {
  // Initiates Google OAuth flow
  // User will be redirected to Google login page
}
@Get('callback')
handleAuthCallback(@Query('token') token: string, @Res() res: Response) {

}
@Get('google/callback')
@UseGuards(GoogleOAuthGuard)
//idhr pe type any temporary lagaya h ideally it should not be like this
async googleAuthCallback(@Req() req: any, @Res() res: Response) {
  // Handle Google OAuth callback
  const googleUser = req.user;

  try {
    const result = await this.authService.googleLogin(googleUser);

    // // Redirect to frontend with token
    // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    // const redirectUrl = `${frontendUrl}/auth/callback?token=${result.access_token}`;

    // res.redirect(redirectUrl);

     return res.json({
      success: true,
      message: 'Google authentication successful',
      access_token: result.access_token,
      user: {
        email: googleUser?.emails,
        firstName: googleUser?.firstName,
        lastName: googleUser?.lastName,
      }
    });
  } catch (error) {
    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const redirectUrl = `${frontendUrl}/auth/error?message=${error.message}`;

    res.redirect(redirectUrl);
  }
}


}