import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY, TOKEN_REFRESH_THRESHOLD } from './utils/constants';

// Define paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register'];

// Match the JWT payload structure from the backend
interface JWTPayload {
  id: number;       // User ID
  username: string; // Username
  exp: number;      // Expiration time
  iat: number;      // Issued at time
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes - they will be handled by Next.js rewrites
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Check if the path is public
  if (publicPaths.includes(pathname) || publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Get the token from cookies or headers
  const token = request.cookies.get(TOKEN_KEY)?.value || 
                request.headers.get('Authorization')?.split(' ')[1];
  
  // If no token exists, redirect to login
  if (!token) {
    console.log('No token found, redirecting to login');
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  try {
    // Decode token to check expiration
    const decodedToken = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    
    // Check if token is expired
    if (decodedToken.exp < currentTime) {
      console.log('Token expired, redirecting to login');
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    
    // Token is valid, proceed
    return NextResponse.next();
    
  } catch (error) {
    // Token is invalid or couldn't be decoded
    console.error('Invalid token', error);
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory files
     * - api routes (API proxying)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|api/).*)',
  ],
};