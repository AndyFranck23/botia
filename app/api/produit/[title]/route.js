import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PUT(request, { params }) {
    try {
        const { title } = await params
        const formData = await request.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        // Insérer le classement
        await queryDB(
            'UPDATE produit SET logo = ?, text = ?, faq = ?, meta_title = ?, meta_description = ?, titre_h1 = ?, content = ?, indexation = ? WHERE title = ?',
            [form?.logo, form?.description, form?.faqListe || [], form?.meta_title, form?.meta_description, form?.titre_h1, JSON.parse(form?.content), form?.indexation, title]
        );

        return NextResponse.json({ message: 'Enregistrement réussi' }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}