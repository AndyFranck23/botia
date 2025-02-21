import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const mention = await queryDB('SELECT * FROM mention_legal');
        return NextResponse.json(mention);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

// 📌 Ajouter un article
export async function POST(req) {
    try {
        const formData = await req.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        await queryDB("INSERT INTO mention_legal (title, content) VALUES (?, ?)", [
            form.title,
            JSON.parse(form.content)
        ]);
        return NextResponse.json({ message: "Mention légal ajouté !" });
    } catch (error) {
        console.error("Erreur dans POST /offres:", error);
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}

// 📌 Ajouter un article
export async function PUT(req) {
    try {
        const formData = await req.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        await queryDB("UPDATE mention_legal SET title = ?, content = ? WHERE id = ?", [
            form.title,
            JSON.parse(form.content),
            1
        ]);
        return NextResponse.json({ message: "Enregistrement réussi" });
    } catch (error) {
        console.error("Erreur dans POST /offres:", error);
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}