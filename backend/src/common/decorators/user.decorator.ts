import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Parameter decorator to extract user ID from CH-USER header
 *
 * The CH-USER header is set by the Fence gateway after JWT validation.
 * This decorator provides a clean way to access the authenticated user ID
 * in controller methods.
 *
 * @example
 * ```typescript
 * @Get('bills')
 * findAll(@CurrentUser() userId: string) {
 *   return this.billsService.findAllByUser(userId);
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userId = request.headers['ch-user'];

    // Header value can be string or string[], we want string
    if (Array.isArray(userId)) {
      return userId[0];
    }

    return userId;
  },
);
