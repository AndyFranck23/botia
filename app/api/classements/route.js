import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from "fs/promises";
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