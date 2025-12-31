import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard component wraps protected routes
 *
 * Authentication Flow:
 * 1. User accesses protected route
 * 2. API calls are made with CowboyHat cookie (automatically sent)
 * 3. Fence gateway validates JWT in cookie
 * 4. If invalid/missing, gateway returns 401
 * 5. Axios interceptor catches 401 and redirects to login
 *
 * Note: Since cookie is HttpOnly, we cannot check auth state client-side.
 * Authentication is verified on each API call by the Fence gateway.
 * This component serves as a logical wrapper for protected routes.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  // Authentication is handled by Fence gateway via CowboyHat cookie
  // 401 responses trigger redirect to login via Axios interceptor
  // No client-side auth check needed since cookie is HttpOnly
  return <>{children}</>;
}
