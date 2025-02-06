// /app/api/demande/route.js
import { NextResponse } from 'next/server'
import { queryDB } from '@/lib/db' // Adaptez le chemin vers votre module de requêtes SQL

export async function GET() {
    try {
        // Récupère toutes les demandes depuis la table "demande"
        const sql = 'SELECT * FROM users WHERE autorisation = ?'
        const demandes = await queryDB(sql, [0])
        return NextResponse.json(demandes, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: error.message || 'Erreur serveur' },
            { status: 500 }
        )
    }
}
