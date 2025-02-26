import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        // Attendre params avant de déstructurer
        const formData = await request.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        // Exécuter la requête en passant les valeurs dans un tableau
        await queryDB(
            'UPDATE classements SET sous_titre = ?, text = ?, content = ?, meta_title = ?, meta_description = ?, titre_h1 = ? WHERE title = ?',
            [
                form.title,
                form.description,
                JSON.parse(form.content),
                form.meta_title,
                form.meta_description,
                form.titre_h1,
                form.classement
            ]
        );

        return NextResponse.json({ message: 'Enregistrement réussi' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}