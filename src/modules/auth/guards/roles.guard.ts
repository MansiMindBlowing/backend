import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// This file defines a NestJS Guard called RolesGuard that 
// handles Authorization, specifically checking if an authenticated user possesses the necessary role(s) 
// to access a particular route.

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  //   Reflector: Yeh NestJS ka tool hai jo metadata (yaani woh information jo hum decorator se route par lagate hain) ko padhta hai.

  // getAllAndOverride<string[]>('roles', ...): Yeh yahan dekhta hai ki aapne route par koi custom decorator lagaya hai kya, jaise: @Roles('admin', 'manager'). Yeh usme se required roles ki list nikal leta hai.

  // If !requiredRoles: Agar route par koi role mention nahi hai, toh Guard turant return true kar deta hai (yani "koi role check nahi hai, jaane do").

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No role requirement
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
