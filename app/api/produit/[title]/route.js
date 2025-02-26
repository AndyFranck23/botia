import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PUT(request, { params }) {
    try {
        const { title } = await params
        const { form } = await request.json(); // Récupérer le corps de la requête

        // Insérer le classement
        await queryDB(
            'UPDATE produit SET sous_titre = ?, text = ?, meta_title = ?, meta_description = ?, titre_h1 = ? WHERE title = ?',
            [form?.title, form?.description, form?.meta_title, form?.meta_description, form?.titre_h1, title]
        );

        return NextResponse.json({ message: 'Titre ajouté avec succès' }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}