// /app/api/demande/[id]/route.js
import { NextResponse } from 'next/server'
import { queryDB } from '@/lib/db' // Adaptez le chemin vers votre module de requêtes SQL

// Supprime une demande selon son id
export async function DELETE(request, { params }) {
    try {
        const { id } = params
        const sql = 'DELETE FROM users WHERE id = ?'
        await queryDB(sql, [id])
        return NextResponse.json(
            { message: 'Demande supprimée avec succès' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: error.message || 'Erreur serveur' },
            { status: 500 }
        )
    }
}

// Met à jour une demande (par exemple pour l'accepter)
// Ici, nous supposons que l'acceptation consiste à modifier un champ "accepted" à 1.
// Adaptez cette logique selon votre modèle de données.
export async function PUT(request, { params }) {
    try {
        const { id } = params
        // Vous pouvez également récupérer le body de la requête si besoin :
        // const { someField } = await request.json()

        const sql = 'UPDATE users SET autorisation=? WHERE id=?'
        await queryDB(sql, [1, id])
        return NextResponse.json(
            { message: 'Demande acceptée avec succès' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: error.message || 'Erreur serveur' },
            { status: 500 }
        )
    }
}
