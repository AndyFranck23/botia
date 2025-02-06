import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const produit = searchParams.get('produit')
    const limit = searchParams.get('limit')
    const title = searchParams.get('title')
    const classement = searchParams.get('classement')
    try {
        if (!title) {
            let out = ''
            if (classement) {
                out = `SELECT * FROM offres WHERE JSON_VALID(classement) 
AND JSON_CONTAINS(CAST(classement AS JSON), '"${classement}"') AND id_produit=? ORDER BY id DESC ${limit ? "LIMIT " + limit : ''}`
            } else {
                out = `SELECT * FROM offres ${produit ? "WHERE id_produit=? " : ""} ORDER BY id DESC ${limit ? "LIMIT " + limit : ''}`
            }
            const offres = await queryDB(out, produit ? [produit] : null);
            return NextResponse.json(offres);
        } else {
            const offre = await queryDB(`SELECT * FROM offres WHERE title=?`, [title]);
            return NextResponse.json(offre[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" }, { status: 500 });
    }
}


export async function POST(request) {
    try {
        // On récupère les données envoyées par le formulaire
        const { form } = await request.json()

        // Validation des champs obligatoires
        if (!form.title || !form.classement || !form.descriptionOC || !form.image || !form.lien) {
            return NextResponse.json(
                { message: "Veuillez remplir les champs nécessaires" },
                { status: 400 }
            )
        }

        // Si l'utilisateur a activé OD, on s'assure que descriptionOD est remplie
        if (form.odActive && !form.descriptionOD) {
            return NextResponse.json(
                { message: "Veuillez remplir le champ OD" },
                { status: 400 }
            )
        }

        // Préparation des données à insérer.
        // On convertit les tableaux en chaîne JSON pour les stocker en BDD (ou adaptez selon votre schéma)
        const classementStr = JSON.stringify(form.classement)
        const descriptionOCStr = JSON.stringify(form.descriptionOC)

        // Préparez la requête SQL d'insertion (adaptez le nom de la table et des colonnes à votre base)
        const sql = `
      INSERT INTO offres 
        (title, classement, descriptionOC, image, prix, reduction, lien, descriptionOD, id_produit)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
        const values = [
            form.title,
            classementStr,
            descriptionOCStr,
            form.image,
            form.prix,
            form.reduction,
            form.lien,
            form.descriptionOD || '',
            form.produit
        ]

        // Exécutez la requête dans votre base de données
        await queryDB(sql, values)

        // Retourne une réponse positive
        return NextResponse.json(
            { message: "Offre ajoutée avec succès" },
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
