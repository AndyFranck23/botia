import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from "fs";
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
        const formData = await request.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        // Validation des données
        if (!form.title) {
            return NextResponse.json(
                { error: "Tout les champs sont requis" },
                { status: 400 }
            );
        }

        let imagePublicPath = ''
        if (form.file) {
            // Définition du dossier d'upload (public/uploads)
            const uploadDir = path.join(process.cwd(), "public/uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            // Génération d'un nom unique pour l'image
            const imageName = `${Date.now()}-${form.file.name}`;
            const filePath = path.join(uploadDir, imageName);

            // Récupération du contenu du fichier sous forme de buffer
            const buffer = Buffer.from(await form.file.arrayBuffer());

            // Sauvegarde du fichier sur le disque
            fs.writeFileSync(filePath, buffer);

            // Construction du chemin public de l'image
            imagePublicPath = `/uploads/${imageName}`;

            // Validation du champ descriptionOD si odActive est activé
            if (form.content == '') {
                return NextResponse.json(
                    { message: "Veuillez remplir le champ descriptionOD" },
                    { status: 400 }
                );
            }
        }


        // Insertion dans la base de données
        await queryDB(
            'INSERT INTO type (title, image) VALUES (?, ?)',
            [form.title, imagePublicPath == '' ? form.image : imagePublicPath]
        );

        return NextResponse.json(
            { message: "Type ajouté avec succès" },
            { status: 201 },
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}