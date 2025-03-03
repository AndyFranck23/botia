import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from "fs";
import path from "path";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit'));
        let sql = ''
        let params = []
        if (type) {
            sql = `SELECT * FROM classements WHERE type = ? ${limit ? "LIMIT " + limit : ""}`
            params = [type]
        } else {
            sql = `SELECT * FROM classements ${limit ? "LIMIT " + limit : ""}`
        }
        const classements = await queryDB(sql, params);
        return NextResponse.json(classements);
    } catch (error) {
        console.error("Erreur serveur:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData);

        if (!form || !form.title || !form.type) {
            return NextResponse.json(
                { message: 'Veuillez remplir tous les champs requis' },
                { status: 400 }
            );
        }

        // Vérifier si le classement existe déjà
        const existingClassement = await queryDB(
            'SELECT * FROM classements WHERE title = ?',
            [form.title]
        );

        if (existingClassement.length > 0) {
            return NextResponse.json(
                { message: 'Ce classement existe déjà' },
                { status: 409 } // 409 Conflict est plus approprié
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

        // Insérer le classement en s'assurant de ne pas passer de valeur undefined
        await queryDB(
            'INSERT INTO classements (title, type, logo, faq, responsable, text, content, meta_title, meta_description, titre_h1, indexation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                form.title || null,
                form.type || null,
                imagePublicPath == '' ? form.image : imagePublicPath,
                form.faqListe || [],
                form.responsable || null,
                form.description,
                JSON.parse(form.content),
                form.meta_title,
                form.meta_description,
                form.title_h1,
                form.indexation,
            ]
        );

        return NextResponse.json(
            { message: 'Classement ajouté avec succès' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erreur serveur:', error);
        return NextResponse.json(
            { message: 'Erreur du serveur' },
            { status: 500 }
        );
    }
}