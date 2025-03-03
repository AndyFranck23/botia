// /app/api/compte/route.js
import { NextResponse } from 'next/server'
import { queryDB } from '@/lib/db' // Adaptez le chemin en fonction de votre projet

export async function GET() {
    try {
        const sql = 'SELECT * FROM users WHERE email NOT IN (?, ?) AND autorisation = ?'
        const comptes = await queryDB(sql, [process.env.LOGIN_ADMIN, 'ironmanandy23@gmail.com', 1])
        return NextResponse.json(comptes, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: error.message || 'Erreur serveur' },
            { status: 500 }
        )
    }
}
