import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({ message: 'Déconnexion réussie' })
    response.cookies.set('authToken', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    })
    return response
}