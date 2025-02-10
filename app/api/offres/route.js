import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const produit = searchParams.get('produit');
        const limit = searchParams.get('limit');
        const slug = searchParams.get('slug');
        const classement = searchParams.get('classement');

        if (!slug) {
            let sqlQuery = '';
            let params = [];

            if (classement) {
                sqlQuery = `SELECT * FROM offres WHERE id_produit = ? AND JSON_CONTAINS(classement, ?, '$') ORDER BY id DESC ${limit ? "LIMIT " + limit : ''}`;
                params = [produit, JSON.stringify({ slug: classement })];
            } else {
                sqlQuery = `SELECT * FROM offres ${produit ? "WHERE id_produit = ? " : ""} ORDER BY id DESC ${limit ? "LIMIT " + limit : ''}`;
                params = produit ? [produit] : [];
            }

            const offres = await queryDB(sqlQuery, params);

            return NextResponse.json(offres || []); // ⚠️ Évite de renvoyer `undefined`
        } else {
            const offre = await queryDB(`SELECT * FROM offres WHERE slug = ?`, [slug]);
            return NextResponse.json(offre?.[0] || { message: "Aucune offre trouvée" });
        }
    } catch (error) {
        console.error("Erreur dans GET /offres:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const form = body.form || {}; // ⚠️ Vérification que `form` existe

        // Validation des champs obligatoires
        const requiredFields = ["title", "classement", "descriptionOC", "image", "lien"];
        for (let field of requiredFields) {
            if (!form[field]) {
                return NextResponse.json(
                    { message: `Le champ ${field} est requis.` },
                    { status: 400 }
                );
            }
        }

        if (form.odActive && !form.descriptionOD) {
            return NextResponse.json(
                { message: "Veuillez remplir le champ descriptionOD" },
                { status: 400 }
            );
        }

        // Conversion des objets en JSON si nécessaire
        const classementStr = JSON.stringify(form.classement);
        const descriptionOCStr = JSON.stringify(form.descriptionOC);

        const sql = `
            INSERT INTO offres 
            (title, slug, classement, descriptionOC, image, prix, reduction, lien, descriptionOD, id_produit)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            form.title,
            form.slug,
            classementStr,
            descriptionOCStr,
            form.image,
            form.prix || 0,
            form.reduction || 0,
            form.lien,
            form.descriptionOD || '',
            form.produit || null
        ];

        await queryDB(sql, values);

        return NextResponse.json(
            { message: "Offre ajoutée avec succès" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur dans POST /offres:", error);
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}
