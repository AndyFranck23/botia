import { queryDB } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const types = await queryDB('SELECT * FROM type WHERE id = ?', [params.id]);
        return NextResponse.json(types);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        await queryDB('DELETE FROM type WHERE id = ?', [params.id])
        return NextResponse.json(
            { message: "Type supprimé avec succès" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la suppression" },
            { status: 500 }
        )
    }
}


export async function PUT(request, { params }) {
    try {
        const body = await request.json()

        if (!body.title && !body.image) {
            return NextResponse.json(
                { error: "Le champ 'title' est requis" },
                { status: 400 }
            )
        }

        await queryDB('UPDATE type SET title = ?, image = ? WHERE id = ?', [body.title, body.image, params.id])

        return NextResponse.json(
            { message: "Type modifié avec succès" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}