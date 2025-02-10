import { queryDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(request, { params }) {
    try {
        await queryDB('DELETE FROM offres WHERE id = ?', [params.id])
        return NextResponse.json(
            { message: "Offre supprimé avec succès" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la suppression" },
            { status: 500 }
        )
    }
}

export async function GET(request, { params }) {
    try {
        const offre = await queryDB('SELECT * FROM offres WHERE id = ?', [params.id]);
        return NextResponse.json(offre);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}


export async function PUT(request, { params }) {
    try {
        // Récupère le corps de la requête qui doit contenir l'objet "form"
        const { form } = await request.json()

        // Validation des champs obligatoires
        if (!form.title || !form.classement || !form.descriptionOC || !form.image || !form.lien) {
            return NextResponse.json(
                { message: "Veuillez remplir les champs nécessaires" },
                { status: 400 }
            )
        }

        // Convertir les tableaux en chaînes JSON pour stockage en BDD (si nécessaire)
        const classementStr = JSON.stringify(form.classement)
        const descriptionOCStr = JSON.stringify(form.descriptionOC)

        // Préparation de la requête SQL pour mettre à jour l'offre
        // On suppose que votre table "offres" contient les colonnes :
        // title, classement, descriptionOC, image, prix, reduction, lien, descriptionOD, id_produit
        const sql = `
      UPDATE offres
      SET 
        title = ?,
        slug = ?,
        classement = ?,
        descriptionOC = ?,
        image = ?,
        prix = ?,
        reduction = ?,
        lien = ?,
        descriptionOD = ?,
        id_produit = ?
      WHERE id = ?
    `

        const values = [
            form.title,
            form.slug,
            classementStr,
            descriptionOCStr,
            form.image,
            form.prix,
            form.reduction,
            form.lien,
            form.descriptionOD || '',
            form.produit, // correspond à l'id ou identifiant du produit associé à l'offre
            params.id   // identifiant de l'offre passé en paramètre d'URL
        ]

        // Exécution de la requête de mise à jour dans la base de données
        await queryDB(sql, values)

        return NextResponse.json(
            { message: "Offre mise à jour avec succès" },
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}
