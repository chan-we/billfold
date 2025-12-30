import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // In development, use a mock user ID from header or default to 1
    const userIdHeader = request.headers['x-user-id'];
    const userId = userIdHeader ? parseInt(userIdHeader as string, 10) : 1;

    // Attach user info to request
    request.user = { userId };

    return true;
  }
}

export function getUserId(request: AuthenticatedRequest): number {
  return request.user?.userId || 1;
}
