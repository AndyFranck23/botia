import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const body = await request.json(); // Récupérer le corps de la requête

        if (!body?.title || !body?.description) {
            return NextResponse.json({ message: 'Veuillez remplir tous les champs requis' }, { status: 400 });
        }

        // Insérer le classement
        await queryDB(
            'UPDATE produit SET sous_titre = ?, text = ? WHERE title = ?',
            [body.title, body.description, params.title]
        );

        return NextResponse.json({ message: 'Titre ajouté avec succès' }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}