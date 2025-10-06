import { 
  Injectable, 
  ConflictException, 
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.model';

import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { EmailService } from './email.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

  /**
   * Register new user with email verification
   */
  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // Generate email verification token
    const { token, expiry } = this.tokenService.generateEmailVerificationToken();

    // Create user
    const user = await this.userModel.create({
      email: registerDto.email,
      password_hash: hashedPassword,
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      role: registerDto.role || 'user',
      login_provider: 'email',
      email_verified: false,
      email_verification_token: token,
      email_verification_token_expires: expiry,
      created_by: null,
      updated_by: null,
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.first_name || 'User',
      token,
    );

    // Return user without sensitive data
    const { password_hash, email_verification_token, ...userWithoutSensitiveData } = user.toJSON();

    return {
      user: userWithoutSensitiveData,
      message: 'Registration successful! Please check your email to verify your account.',
    };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      where: { email_verification_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    // Check if already verified
    if (user.email_verified) {
      throw new BadRequestException('Email already verified');
    }

    // Check if token expired
    if (this.tokenService.isTokenExpired(user.email_verification_token_expires)) {
      throw new BadRequestException('Verification token has expired. Please request a new one.');
    }

    // Update user
    await user.update({
      email_verified: true,
      email_verification_token: null,
      email_verification_token_expires: null,
      updated_by: user.id,
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(
      user.email,
      user.first_name || 'User',
    );

    return {
      message: 'Email verified successfully! You can now login.',
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email_verified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new token
    const { token, expiry } = this.tokenService.generateEmailVerificationToken();

    await user.update({
      email_verification_token: token,
      email_verification_token_expires: expiry,
    });

    // Send email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.first_name || 'User',
      token,
    );

    return {
      message: 'Verification email sent! Please check your inbox.',
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.userModel.findOne({
      where: { email: loginDto.email, is_deleted: false },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if password exists (not OAuth user)
    if (!user.password_hash) {
      throw new UnauthorizedException('Please login with Google');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is active
    if (!user.is_active) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in. Check your inbox for verification link.',
      );
    }

    // Update last login
    await user.update({
      last_login: new Date(),
    });

    // Generate JWT token
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    // Return user and token
    const { password_hash, ...userWithoutPassword } = user.toJSON();

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  /**
   * Get current user details
   */
  async getCurrentUser(userId: number) {
    const user = await this.userModel.scope('withoutPassword').findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
 * Handle Google OAuth login/register
 */
async googleLogin(googleUser: any) {
  // Check if user exists by google_id
  let user = await this.userModel.findOne({
    where: { google_id: googleUser.google_id },
  });

  if (user) {
    // Existing Google user - just login
    await user.update({
      last_login: new Date(),
      profile_picture: googleUser.profile_picture, // Update profile picture
    });
  } else {
    // Check if email already exists (registered with email/password)
    const existingEmailUser = await this.userModel.findOne({
      where: { email: googleUser.email },
    });

    if (existingEmailUser) {
      // Link Google account to existing email account
      await existingEmailUser.update({
        google_id: googleUser.google_id,
        profile_picture: googleUser.profile_picture,
        email_verified: true, // Google emails are already verified
        last_login: new Date(),
      });
      user = existingEmailUser;
    } else {
      // Create new user from Google data
      user = await this.userModel.create({
        email: googleUser.email,
        google_id: googleUser.google_id,
        first_name: googleUser.first_name,
        last_name: googleUser.last_name,
        profile_picture: googleUser.profile_picture,
        login_provider: 'google',
        email_verified: true, // Google emails are already verified
        password_hash: null, // No password for OAuth users
        role: 'user',
        last_login: new Date(),
        created_by: null,
        updated_by: null,
      });

      // Send welcome email
      await this.emailService.sendWelcomeEmail(
        user.email,
        user.first_name || 'User',
      );
    }
  }

  // Generate JWT token
  const payload = {
    email: user.email,
    sub: user.id,
    role: user.role,
  };

  const access_token = this.jwtService.sign(payload);

  // Return user and token
  const { password_hash, ...userWithoutPassword } = user.toJSON();

  return {
    access_token,
    user: userWithoutPassword,
  };
}
}