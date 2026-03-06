import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip admin routes and API routes
  const path = request.nextUrl.pathname
  if (path.startsWith('/admin') || path.startsWith('/api')) {
    return NextResponse.next()
  }

  // Check maintenance mode cookie (set by admin)
  const maintenance = request.cookies.get('maintenance_mode')?.value
  if (maintenance === 'true') {
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
