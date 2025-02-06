import { queryDB } from '@/lib/db'
import { NextResponse } from 'next/server'


export async function GET(request, { params }) {
    try {
        const classement = await queryDB('SELECT * FROM classements WHERE id = ?', [params.id]);
        return NextResponse.json(classement);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        await queryDB('DELETE FROM classements WHERE id = ?', [params.id])
        return NextResponse.json(
            { message: "Classement supprimé avec succès" },
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
        const body = await request.json(); // Récupérer le corps de la requête
        const { form } = body;

        if (!form?.title || !form?.type) {
            return NextResponse.json({ message: 'Veuillez remplir tous les champs requis' }, { status: 400 });
        }

        // Insérer le classement
        await queryDB(
            'UPDATE classements SET title = ?, type = ?, logo=?, faq=?, responsable=? WHERE id = ?',
            [form.title, form.type, form.logo, JSON.stringify(form.faqListe), form.responsable, params.id]
        );

        return NextResponse.json({ message: 'Classement modifié avec succès' }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}