// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/apps/home', '/home', '/apps/profile']
const authRoutes = ['/login', '/signup', '/forgot-password']
const publicRoutes = ['/', '/verify-email', '/reset-password', '/resend-verification']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle CORS for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    const origin = request.headers.get('origin')
    
    if (origin && origin.endsWith('sendexa.co')) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
    
    return response
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isPublicRoute = publicRoutes.includes(pathname)

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  const isAuthenticated = await verifyAuth(accessToken, refreshToken, request)

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/apps/home', request.url))
  }

  return NextResponse.next()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyAuth(accessToken: string | undefined, refreshToken: string | undefined, request: NextRequest): Promise<boolean> {
  if (!accessToken) return false

  try {
    const verifyRes = await fetch('https://onetime.sendexa.co/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (verifyRes.ok) return true

    if (refreshToken) {
      const refreshRes = await fetch('https://onetime.sendexa.co/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (refreshRes.ok) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshRes.json()
        
        const response = NextResponse.next()
        response.cookies.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        })
        
        if (newRefreshToken) {
          response.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
          })
        }

        return true
      }
    }

    return false
  } catch (error) {
    console.error('Auth verification error:', error)
    return false
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}