import { Table, Column, DataType, HasMany, Scopes } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Form } from './form.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
@Scopes(() => ({
  withoutPassword: {
    attributes: { 
      exclude: [
        // 'password_hash', 
        'email_verification_token',
        'email_verification_token_expires',
        'password_reset_token',
        'password_reset_token_expires',
      ] 
    },
  },
}))
export class User extends BaseModel {
  // ============================================
  // BASIC INFORMATION
  // ============================================

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    comment: 'User email address',
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true, // Null for Google OAuth users without password
    comment: 'Hashed password (null for OAuth users)',
  })
  password_hash: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  first_name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  last_name: string;

  // ============================================
  // ROLE & STATUS
  // ============================================
  
  @Column({
    type: DataType.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
    comment: 'User role: admin or user',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Account active status',
  })
  is_active: boolean;

  // ============================================
  // EMAIL VERIFICATION
  // ============================================
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Email verification status',
  })
  email_verified: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Token for email verification',
  })
  email_verification_token: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Email verification token expiry',
  })
  email_verification_token_expires: Date;

  // ============================================
  // PASSWORD RESET
  // ============================================
  
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'Token for password reset',
  })
  password_reset_token: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Password reset token expiry',
  })
  password_reset_token_expires: Date;

  // ============================================
  // OAUTH (GOOGLE)
  // ============================================
  
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    unique: true,
    comment: 'Google user ID for OAuth',
  })
  google_id: string;

  @Column({
    type: DataType.ENUM('email', 'google'),
    allowNull: false,
    defaultValue: 'email',
    comment: 'Login provider: email or google',
  })
  login_provider: string;

  // ============================================
  // PROFILE
  // ============================================
  
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'Profile picture URL',
  })
  profile_picture: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Last login timestamp',
  })
  last_login: Date;

  // ============================================
  // RELATIONSHIPS
  // ============================================
  
  @HasMany(() => Form)
  forms: Form[];
}