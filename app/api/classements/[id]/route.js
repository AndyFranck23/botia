import { queryDB } from '@/lib/db'
import { NextResponse } from 'next/server'
import fs from "fs";
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
            // if (form.content == '') {
            //     return NextResponse.json(
            //         { message: "Veuillez remplir le champ descriptionOD" },
            //         { status: 400 }
            //     );
            // }
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