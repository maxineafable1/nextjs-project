import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './actions/auth'

// 1. Specify protected and public routes
export const protectedRoutes = ['/dashboard']
export const publicRoutes = ['/login', '/signup']

export default async function middleware(req: NextRequest, res: NextResponse) {
  // check current route if public or private
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const session = await getSession()

  // redirect to login if user is not authenticated
  if (isProtectedRoute && !session.active)
    return NextResponse.redirect(new URL('/login', req.nextUrl))

  // redirect to dashboard if use is authenticated
  if (isPublicRoute && session.active)
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))

  return NextResponse.next()
}

// routes middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}