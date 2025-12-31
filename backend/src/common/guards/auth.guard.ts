import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

/**
 * AuthGuard for Fence gateway integration
 *
 * Reads user ID from CH-USER header set by Fence gateway after JWT validation.
 * Returns 401 Unauthorized if header is missing (request bypassed gateway).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Read user ID from CH-USER header (set by Fence gateway)
    const userIdHeader = request.headers['ch-user'];

    if (!userIdHeader) {
      throw new UnauthorizedException('Authentication required');
    }

    // Header value can be string or string[], we want the first value
    const userIdStr = Array.isArray(userIdHeader)
      ? userIdHeader[0]
      : userIdHeader;
    const userId = parseInt(userIdStr, 10);

    if (isNaN(userId)) {
      throw new UnauthorizedException('Invalid user identification');
    }

    // Attach user info to request
    request.user = { userId };

    return true;
  }
}

export function getUserId(request: AuthenticatedRequest): number {
  if (!request.user?.userId) {
    throw new UnauthorizedException('User not authenticated');
  }
  return request.user.userId;
}
