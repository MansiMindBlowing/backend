// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor() {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//       scope: ['email', 'profile'],
//       //  accessType: 'offline',
//       // prompt: 'consent select_account',
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { id, name, emails, photos } = profile;

//     const user = {
//       google_id: id,
//       email: emails[0].value,
//       first_name: name.givenName,
//       last_name: name.familyName,
//       profile_picture: photos[0]?.value,
//     };

//     done(null, user);
//   }
// }

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../models/user.model';
import { EmailService } from 'src/modules/services/email.service';
// import { EmailService } from '../../../common/services/email.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private emailService: EmailService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: any,
  //   done: VerifyCallback,
  // ): Promise<any> {
  //   try {
  //     // Debug: Log raw profile to see structure
  //     console.log('=== RAW GOOGLE PROFILE ===');
  //     console.log('Profile ID:', profile.id);
  //     console.log('Display Name:', profile.displayName);
  //     console.log('Name Object:', JSON.stringify(profile.name, null, 2));
  //     console.log('Emails:', JSON.stringify(profile.emails, null, 2));
  //     console.log('Photos:', JSON.stringify(profile.photos, null, 2));
  //     console.log('==========================');

  //     // ✅ FIXED: Proper extraction from Google profile
  //     const googleId = profile.id;
  //     const email = profile.emails?.[0]?.value;
  //     const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
  //     const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '';
  //     const profilePicture = profile.photos?.[0]?.value || null;

  //     console.log('🔍 Extracted data:');
  //     console.log('  Email:', email);
  //     console.log('  First Name:', firstName);
  //     console.log('  Last Name:', lastName);
  //     console.log('  Google ID:', googleId);

  //     if (!email) {
  //       throw new Error('Email not provided by Google');
  //     }

  //     // Check if user exists with Google ID
  //     let user = await this.userModel.findOne({
  //       where: { google_id: googleId },
  //     });

  //     let isNewUser = false;

  //     if (!user) {
  //       // Check if user exists with same email
  //       user = await this.userModel.findOne({
  //         where: { email },
  //       });

  //       if (user) {
  //         // Link Google account to existing user
  //         console.log('🔗 Linking Google account to existing user:', email);
  //         await user.update({
  //           google_id: googleId,
  //           email_verified: true,
  //           profile_picture: profilePicture,
  //           updated_by: user.id,
  //         });
  //       } else {
  //         // Create new user
  //         console.log('🆕 Creating new Google user:', email);
  //         user = await this.userModel.create({
  //           email,
  //           first_name: firstName,
  //           last_name: lastName,
  //           google_id: googleId,
  //           login_provider: 'google',
  //           email_verified: true,
  //           is_active: true,
  //           profile_picture: profilePicture,
  //           role: 'user',
  //           password_hash: null,
  //           created_by: null,
  //           updated_by: null,
  //         });

  //         isNewUser = true;
  //         console.log('✅ New user created with ID:', user.id);
  //       }
  //     } else {
  //       console.log('👤 Existing Google user logging in:', email);
  //     }

  //     // Update last login
  //     await user.update({ last_login: new Date() });

  //     // ✅ SEND WELCOME EMAIL FOR NEW USERS
  //     if (isNewUser) {
  //       console.log('📧 Attempting to send welcome email...');
  //       console.log('  To:', user.email);
  //       console.log('  Name:', user.first_name);
        
  //       try {
  //         const emailSent = await this.emailService.sendWelcomeEmail(
  //     //       user.get('email') || user.dataValues.email,
  //     // user.get('first_name') || user.dataValues.first_name || 'User',
  //     email,      // Use the email from Google
  //     firstName, 
  //         );
          
  //         if (emailSent) {
  //           console.log('✅ Welcome email sent successfully!');
  //         } else {
  //           console.log('❌ Welcome email failed to send');
  //         }
  //       } catch (emailError) {
  //         console.error('❌ Error sending welcome email:', emailError.message);
  //         // Don't fail login if email fails
  //       }
  //     }

  //     // Pass user to controller
  //     const userWithMetadata = {
  //       ...user.toJSON(),
  //       isNewUser,
  //     };
  //     //this isNewUser is passed to controller with endpoint auth/google/callback as user aboject
  //     // idhr pe the controller then can access the standard user and custom user metadata
  //     // This allows the Controller to make decisions, 
  //     // such as: "If req.user.isNewUser is true, redirect them to the Welcome screen; otherwise, redirect them to the Dashboard."

  //     done(null, userWithMetadata);
  //   } catch (error) {
  //     console.error('❌ Google OAuth validation error:', error);
  //     // done(error, null);
  //   }
  // }

  async validate(
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback,
): Promise<any> {
  try {
    console.log('=== RAW GOOGLE PROFILE ===');
    console.log('Profile ID:', profile.id);
    console.log('Display Name:', profile.displayName);
    console.log('Name Object:', JSON.stringify(profile.name, null, 2));
    console.log('Emails:', JSON.stringify(profile.emails, null, 2));
    console.log('==========================');

    // Extract data from Google profile
    const googleUser = {
      google_id: profile.id,
      email: profile.emails?.[0]?.value,
      first_name: profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User',
      last_name: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
      profile_picture: profile.photos?.[0]?.value || null,
    };

    console.log('🔍 Extracted Google data:', googleUser);

    if (!googleUser.email) {
      throw new Error('Email not provided by Google');
    }

    // Just pass the data, don't do database operations here
    done(null, googleUser);
  } catch (error) {
    console.error('❌ Google validation error:', error);
    // done(error, null);
  }
}
}