import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from "fs/promises";
import path from "path";

export async function GET() {
    try {
        const types = await queryDB('SELECT * FROM type');
        return NextResponse.json(types);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get("title");
        const file = formData.get("file");

        // Vérification des champs requis
        if (!title) {
            return NextResponse.json(
                { error: "Le champ 'title' est requis" },
                { status: 400 }
            );
        }

        let imagePublicPath = "";

        if (file) {
            // Vérifier si file est bien un objet File
            if (!(file instanceof File)) {
                return NextResponse.json(
                    { error: "Le fichier est invalide" },
                    { status: 400 }
                );
            }

            // Définition du dossier d'upload (en dehors de /public/)
            const uploadDir = path.join(process.cwd(), "uploads"); // Stocke dans un dossier hors `public`
            await fs.mkdir(uploadDir, { recursive: true }); // Création du dossier si inexistant

            // Génération d'un nom unique pour l'image
            const imageName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
            const filePath = path.join(uploadDir, imageName);

            // Sauvegarde de l'image
            const buffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(filePath, buffer);

            // Construction du chemin pour servir l'image via une API
            imagePublicPath = `/api/uploads/${imageName}`;
        }

        // Insertion dans la base de données
        await queryDB(
            "INSERT INTO type (title, image) VALUES (?, ?)",
            [title, imagePublicPath]
        );

        return NextResponse.json(
            { message: "Type ajouté avec succès", image: imagePublicPath },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}