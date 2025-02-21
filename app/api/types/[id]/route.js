import { queryDB } from '@/lib/db'
import { NextResponse } from 'next/server'
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
    try {
        const types = await queryDB('SELECT * FROM type WHERE id = ?', [params.id]);
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