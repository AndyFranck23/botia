import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const classements = await queryDB(`SELECT * FROM classements`);
        return NextResponse.json(classements);
    } catch (error) {
        console.error("Erreur serveur:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json(); // Récupérer le corps de la requête
        const { form } = body;

        if (!form?.title || !form?.type) {
            return NextResponse.json({ message: 'Veuillez remplir tous les champs requis' }, { status: 400 });
        }

        // Vérifier si le classement existe déjà
        const existingClassement = await queryDB('SELECT * FROM classements WHERE title = ?', [form.title]);

        if (existingClassement.length > 0) {
            return NextResponse.json({ message: 'Ce classement existe déjà' }, { status: 409 }); // 409 Conflict est plus approprié
        }

        // Insérer le classement
        await queryDB(
            'INSERT INTO classements (title, description, type, logo, faq, responsable) VALUES (?, ?, ?, ?, ?, ?)',
            [form.title, form.description, form.type, form.logo, JSON.stringify(form.faqListe), form.responsable]
        );

        return NextResponse.json({ message: 'Classement ajouté avec succès' }, { status: 201 });

    } catch (error) {
        console.error('Erreur serveur:', error);
        return NextResponse.json({ message: 'Erreur du serveur' }, { status: 500 });
    }
}