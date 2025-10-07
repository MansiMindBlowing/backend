import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

// jwt stratgy it validates jwt token
// strategy is authentication method

// The JwtStrategy class extends PassportStrategy(Strategy) and is configured to:

// Extract the JWT: It's set up to look for the JWT in the Authorization header of an incoming HTTP request, specifically using the Bearer token scheme (ExtractJwt.fromAuthHeaderAsBearerToken()).

// Verify the Signature: It uses the secret key (secretOrKey) to cryptographically verify that the token hasn't been tampered with since it was issued. The secret is pulled from environment variables (process.env.JWT_SECRET) or defaults to a placeholder.

// Check Expiration: It is configured not to ignore expiration (ignoreExpiration: false), meaning it will automatically reject tokens that have expired.

// Validate the Payload (validate method): If the token is valid (not expired, correct signature), the validate method is called with the token's decoded payload.

// It uses the sub (subject) field from the payload (which usually holds the user's ID) to fetch the user's details from the database via usersService.findById().

// It performs additional checks, such as ensuring the user exists and that their account is active (user.is_active).

// If validation fails at any point, it throws an UnauthorizedException.

// If successful, it returns the user object. This user object is then attached to the request object, making the user's data accessible in your controllers.

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  //this line here is used to extract tiken from header
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || '88ed733bb3166abdbb3cc6faf2ba4886',
    });
  }

  // async validate(payload: any) {
  //   const user = await this.usersService.findById(payload.sub);

  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   if (!user.is_active) {
  //     throw new UnauthorizedException('User account is inactive');
  //   }

  //   return user;
  // }

  //  async validate(payload: any) {
  //   this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);

  //   const userId = payload.sub ?? payload.id ?? payload.userId;
  //   if (!userId) {
  //     throw new UnauthorizedException('Invalid token payload');
  //   }

  //   const user = await this.usersService.findById(Number(userId)); // implement findById in UsersService
  //   this.logger.debug('JwtStrategy found user: ' + JSON.stringify(user && {
  //     id: user.id, email: user.email, role: user.role, is_active: user.is_active,
  //   }));

  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }
  //   if (!user.is_active) {
  //     throw new UnauthorizedException('User account is inactive');
  //   }

  //   // return the user object (not the payload)
  //   return user;
  // }

  async validate(payload: any) {
  this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);

  const userId = payload.sub ?? payload.id ?? payload.userId;
  if (!userId) {
    throw new UnauthorizedException('Invalid token payload');
  }

  const userModelInstance = await this.usersService.findById(Number(userId));
  // Convert Sequelize model -> plain object to avoid issues from "public class fields" shadowing
  const user = (userModelInstance && typeof (userModelInstance as any).toJSON === 'function')
    ? (userModelInstance as any).toJSON()
    : userModelInstance;

  this.logger.debug('JwtStrategy found user: ' + JSON.stringify({
    id: user?.id,
    email: user?.email,
    role: user?.role,
    is_active: user?.is_active,
  }));

  if (!user) {
    throw new UnauthorizedException('User not found');
  }
  if (!user.is_active) {
    throw new UnauthorizedException('User account is inactive');
  }

  // return plain object (ok for request.user)
  return user;
}

}
