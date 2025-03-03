import { NextResponse } from "next/server";
import { queryDB } from "@/lib/db";
import { slugify } from "@/components/Slug";

// 📌 Récupérer les articles
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const id = searchParams.get('id');
        let sql = ""
        let params = []
        if (slug) {
            sql = `SELECT * FROM blog WHERE slug = ?`
            params = [slug]
        } else if (id) {
            sql = `SELECT * FROM blog WHERE id = ?`
            params = [id]
        } else {
            sql = "SELECT * FROM blog ORDER BY id DESC"
            params = []
        }

        const rows = await queryDB(sql, params);
        return NextResponse.json(rows);
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

        await queryDB("INSERT INTO blog (title, slug, content, indexation, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?)", [
            form.title || null,
            slugify(form.title),
            JSON.parse(form.content),
            form.indexation || null,
            form.meta_title || null,
            form.description || null
        ]);
        return NextResponse.json({ message: "Article ajouté !" });
    } catch (error) {
        console.error("Erreur dans POST /offres:", error);
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}

