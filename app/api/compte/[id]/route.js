// /app/api/compte/[id]/route.js
import { NextResponse } from 'next/server'
import { queryDB } from '@/lib/db' // Adaptez le chemin en fonction de votre projet

export async function DELETE(request, { params }) {
    try {
        const { id } = params
        const sql = 'DELETE FROM users WHERE id = ?'
        await queryDB(sql, [id])
        return NextResponse.json(
            { message: 'Compte supprimé avec succès' },
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: error.message || 'Erreur serveur' },
            { status: 500 }
        )
    }
}
