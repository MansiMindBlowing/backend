import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../../models/user.model';
import { TokenService } from '../services/token.service';
import { EmailService } from '../services/email.service';
import { AuthService } from '../services/auth.service';
// import { EmailService } from '../../common/services/email.service';
// import { TokenService } from '../../common/services/token.service';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService, TokenService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
