import { queryDB } from '@/lib/db'
import { NextResponse } from 'next/server'
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
    try {
        const { id } = await params
        const types = await queryDB('SELECT * FROM type WHERE id = ?', [id]);
        return NextResponse.json(types);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = await params
        await queryDB('DELETE FROM type WHERE id = ?', [id])
        return NextResponse.json(
            { message: "Type supprimé avec succès" },
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
        const { id } = await params
        const formData = await request.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        if (!form.title && !form.image) {
            return NextResponse.json(
                { error: "Le champ 'title' est requis" },
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

        await queryDB('UPDATE type SET title = ?, image = ? WHERE id = ?', [form.title, imagePublicPath == '' ? form.image : imagePublicPath, id])

        return NextResponse.json(
            { message: "Type modifié avec succès" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        )
    }
}