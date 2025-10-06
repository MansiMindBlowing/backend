import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  /**
   * Generate a unique verification token
   * @returns UUID v4 token
   */
  generateVerificationToken(): string {
    return uuidv4();
  }

  /**
   * Generate token expiry date
   * @param hours - Hours until expiry
   * @returns Date object
   */
  generateTokenExpiry(hours: number): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + hours);
    return expiry;
  }

  /**
   * Check if token is expired
   * @param expiryDate - Token expiry date
   * @returns boolean
   */
  isTokenExpired(expiryDate: Date): boolean {
    return new Date() > new Date(expiryDate);
  }

  /**
   * Generate email verification token with expiry
   * @returns Object with token and expiry
   */
  generateEmailVerificationToken() {
    return {
      token: this.generateVerificationToken(),
      expiry: this.generateTokenExpiry(24), // 24 hours
    };
  }

  /**
   * Generate password reset token with expiry
   * @returns Object with token and expiry
   */
  generatePasswordResetToken() {
    return {
      token: this.generateVerificationToken(),
      expiry: this.generateTokenExpiry(1), // 1 hour
    };
  }
}