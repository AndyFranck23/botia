import { NextResponse } from 'next/server'

export function middleware(request) {
    const token = request.cookies.get('authToken')?.value
    const protectedRoutes = ['/admin']

    if (!token && protectedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}