import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const types = await queryDB('SELECT * FROM type');
        return NextResponse.json(types);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validation des données
        if (!body.title && !body.image) {
            return NextResponse.json(
                { error: "Tout les champs sont requis" },
                { status: 400 }
            );
        }

        // Insertion dans la base de données
        const result = await queryDB(
            'INSERT INTO type (title, image) VALUES (?, ?)',
            [body.title, body.image]
        );

        return NextResponse.json(
            { id: result.insertId, ...body },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}