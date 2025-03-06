import { slugify } from "@/components/Slug";
import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";

// 📌 Ajouter un article
export async function PUT(req, { params }) {
    try {
        const { id } = await params
        const formData = await req.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        await queryDB("UPDATE page SET title = ?, slug = ?, content = ?, indexation = ?, meta_title = ?, meta_description = ? WHERE id = ?", [
            form.title,
            slugify(form.title),
            JSON.parse(form.content),
            form.indexation || null,
            form.meta_title || null,
            form.meta_description || null,
            id
        ]);
        return NextResponse.json({ message: "Page modifié avec succès" });
    } catch (error) {
        console.error("Erreur dans POST /offres:", error);
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    const { id } = await params
    try {
        await queryDB('DELETE FROM page WHERE id = ?', [id])
        return NextResponse.json(
            { message: "Page supprimé avec succès" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la suppression" },
            { status: 500 }
        )
    }
}
