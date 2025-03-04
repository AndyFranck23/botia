import { queryDB } from '@/lib/db'
import { NextResponse } from 'next/server'
import fs from "fs/promises";
import path from "path";
import { slugify } from '@/components/Slug';


export async function GET(request, { params }) {
    try {
        const { id } = await params
        const classement = await queryDB('SELECT * FROM classements WHERE id = ?', [id]);
        return NextResponse.json(classement);
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
        await queryDB('DELETE FROM classements WHERE id = ?', [id])
        return NextResponse.json(
            { message: "Classement supprimé avec succès" },
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
        // Attendre params avant de déstructurer
        const { id } = await params;
        const formData = await request.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        if (!form || !form.title || !form.type) {
            return NextResponse.json(
                { message: 'Veuillez remplir tous les champs requis' },
                { status: 400 }
            );
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

        // const classementStr = form.classement ? JSON.stringify(JSON.parse(form.classement)) : null;

        // await queryDB(`UPDATE offres SET classement = ? WHERE JSON_CONTAINS(classement, ?, '$')`,
        //     [5, JSON.stringify({ id: id })]
        // )

        // Exécuter la requête en passant les valeurs dans un tableau
        await queryDB(
            'UPDATE classements SET title = ?, type = ?, logo = ?, faq = ?, responsable = ?, text = ?, content = ?, meta_title = ?, meta_description = ?, titre_h1 = ?, indexation = ? WHERE id = ?',
            [
                form.title || null,
                form.type || null,
                imagePublicPath == '' ? form.image : imagePublicPath,
                form.faqListe || [],
                form.responsable || null,
                form.description || null,
                JSON.parse(form.content) || null,
                form.meta_title || null,
                form.meta_description || null,
                form.title_h1 || null,
                form.indexation || null,
                id || null
            ]
        );

        return NextResponse.json({ message: 'Classement modifié avec succès' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}