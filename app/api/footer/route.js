import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";


// GET - Récupérer toutes les colonnes
export async function GET() {
    try {
        const columns = await queryDB("SELECT * FROM footer");
        return NextResponse.json(columns);
    } catch (error) {
        return NextResponse.json({ message: "Erreur lors de la récupération", error });
    }
}

// PUT - Mettre à jour une colonne existante
export async function PUT(req) {
    try {
        const { form, text } = await req.json(); // Liste des colonnes [{ id, title, lists }, ...]
        let index = 2
        form?.forEach(async (element) => {
            await queryDB("UPDATE footer SET title = ?, lists = ?, text = ? WHERE id = ?", [element.title, JSON.stringify(element.lists), text, index++])
        });

        return NextResponse.json({ message: "Données sauvegardées avec succès" });
    } catch (error) {
        console.error("Erreur PUT /api/footer:", error);
        NextResponse.json({ error: "Erreur serveur" });
    }
}


// // DELETE - Supprimer une colonne
// export async function DELETE(req) {
//     try {
//         const { id } = await req.json();
//         await queryDB("DELETE FROM footer WHERE id = ?", [id]);
//         return NextResponse.json({ message: "Colonne supprimée avec succès" });
//     } catch (error) {
//         return NextResponse.json({ error: "Erreur lors de la suppression de la colonne" }, { status: 500 });
//     }
// }