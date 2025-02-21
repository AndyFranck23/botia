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
            'INSERT INTO titre (produit, classement, sous_titre, text) VALUES (?, ?, ?, ?)',
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
        let sql = ''
        if (produit)
            sql = 'SELECT * FROM titre WHERE produit = ?';
        if (classement)
            sql = 'SELECT * FROM titre WHERE classement = ?';

        const titre = await queryDB(sql, [produit ? produit : classement])
        return NextResponse.json(titre);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
