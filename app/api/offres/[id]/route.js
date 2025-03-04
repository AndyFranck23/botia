import { slugify } from "@/components/Slug"
import { queryDB } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs/promises";
import path from "path";

export async function DELETE(request, { params }) {
    const { id } = await params
    try {
        await queryDB('DELETE FROM offres WHERE id = ?', [id])
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
    const { id } = await params
    try {
        const offre = await queryDB('SELECT * FROM offres WHERE id = ?', [id]);
        return NextResponse.json(offre);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}


export async function PUT(request, { params }) {
    const { id } = await params
    try {
        // Récupère le corps de la requête qui doit contenir l'objet "form"
        const formData = await request.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData); // Convertit formData en objet pour un accès facile

        // Validation des champs obligatoires
        if (!form.title) {
            return NextResponse.json(
                { message: "Veuillez remplir les champs nécessaires" },
                { status: 400 }
            )
        }

        let imagePublicPath = ''
        if (form.file) {
            // Vérifier si file est bien un objet File
            if (!(form.file instanceof File)) {
                return NextResponse.json(
                    { error: "Le fichier est invalide" },
                    { status: 400 }
                );
            }
            // Définition du dossier d'upload (en dehors de /public/)
            const uploadDir = path.join(process.cwd(), "uploads"); // Stocke dans un dossier hors `public`
            await fs.mkdir(uploadDir, { recursive: true }); // Création du dossier si inexistant

            // Génération d'un nom unique pour l'image
            const imageName = `${Date.now()}-${form.file.name.replace(/\s/g, "_")}`;
            const filePath = path.join(uploadDir, imageName);

            // Sauvegarde de l'image
            const buffer = Buffer.from(await form.file.arrayBuffer());
            await fs.writeFile(filePath, buffer);

            // Construction du chemin pour servir l'image via une API
            imagePublicPath = `/api/uploads/${imageName}`;
        }

        // Convertir les tableaux en chaînes JSON pour stockage en BDD (si nécessaire)
        const classementStr = form.classement ? JSON.stringify(JSON.parse(form.classement)) : null;
        // const descriptionOCStr = JSON.stringify(form.descriptionOC)

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
        id_produit = ?,
        indexation = ?,
        content = ?,
        meta_title = ?,
        meta_description = ?,
        responsable = ?
      WHERE id = ?
    `

        const values = [
            JSON.parse(form.title),
            JSON.parse(form.slug),
            classementStr,
            JSON.parse(form.descriptionOC),
            imagePublicPath == '' ? JSON.parse(form.image) : imagePublicPath, JSON.parse(form.prix),
            JSON.parse(form.reduction),
            JSON.parse(form.lien),
            slugify(JSON.parse(form.produit)), // correspond à l'id ou identifiant du produit associé à l'offre
            JSON.parse(form.indexation),
            JSON.parse(form.content),
            JSON.parse(form.meta_title),
            JSON.parse(form.meta_description),
            JSON.parse(form.responsable),
            id   // identifiant de l'offre passé en paramètre d'URL
        ]

        // Exécution de la requête de mise à jour dans la base de données
        await queryDB(sql, values)

        return NextResponse.json(
            { message: "Offre mis à jour avec succès" },
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
