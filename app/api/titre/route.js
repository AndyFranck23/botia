import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json(); // Récupérer le corps de la requête

        if (!body?.title || !body?.description) {
            return NextResponse.json({ message: 'Veuillez remplir tous les champs requis' }, { status: 400 });
        }

        // Insérer le classement
        await queryDB(
            'INSERT INTO titre (produit, classement, titre, description) VALUES (?, ?, ?, ?)',
            [body.produit, body.classement, body.title, body.description]
        );

        return NextResponse.json({ message: 'Titre ajouté avec succès' }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const produit = searchParams.get('produit');
        const classement = searchParams.get('classement');
        const titre = await queryDB('SELECT * FROM titre WHERE produit = ? AND classement = ?', [produit, classement]);
        return NextResponse.json(titre);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
