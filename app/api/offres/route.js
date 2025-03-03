import { nombrePage, slugify } from '@/components/Slug';
import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || nombrePage; // Nombre d'éléments par page
        const offset = (page - 1) * limit; // Décalage pour l'OFFSET
        const produit = searchParams.get('produit');
        const slug = searchParams.get('slug');
        const classement = searchParams.get('classement');
        const accueil = searchParams.get('accueil');
        const nbre = searchParams.get('nbre');

        let sqlQuery = '';
        let params = [];

        if (!slug) {
            if (accueil == 'tous') {
                // sqlQuery = `SELECT * FROM offres WHERE id IN (SELECT MIN(id) FROM offres GROUP BY id_produit) ORDER BY id DESC LIMIT 5 OFFSET 15;`;
                sqlQuery = `SELECT o.title AS title, o.slug AS slug, COUNT(c.id) AS clicks, o.classement AS classement, o.descriptionOC AS descriptionOC, o.image AS image, o.prix AS prix, o.reduction AS reduction, o.lien AS lien, o.id_produit AS id_produit, o.indexation AS indexation, o.content AS content, o.meta_title AS meta_title, o.meta_description AS meta_description
                        FROM offres o 
                        LEFT JOIN clicks c ON o.id = c.offre_id WHERE status = 'publier'
                        GROUP BY o.id
                        ORDER BY clicks DESC
                        LIMIT 30`;
            }
            else if (classement) {
                sqlQuery = `SELECT * FROM offres WHERE JSON_CONTAINS(classement, ?, '$') AND status = 'publier' ORDER BY id DESC LIMIT ? OFFSET ?`;
                params = [JSON.stringify({ slug: classement }), limit, offset];
            } else {
                sqlQuery = `SELECT * FROM offres ${produit ? "WHERE id_produit = ? AND status = 'publier'" : "WHERE status = 'publier'"} ORDER BY id DESC LIMIT ? OFFSET ?`;
                params = produit ? [produit, limit, offset] : [limit, offset];
            }
        }

        if (slug) {
            sqlQuery = `SELECT * FROM offres WHERE slug = ? AND status = 'publier'`;
            params = [slug];
            const offre = await queryDB(sqlQuery, params);
            return NextResponse.json(offre[0] || { message: "Aucune offre trouvée" });
        }

        let total = 0
        // Récupération des nombres d'offres de chaque classement et produit pour la page d'accueil
        if (nbre) {
            const offres = await queryDB(`SELECT classement, id_produit FROM offres WHERE status = 'publier'`, []);
            return NextResponse.json({ offres });
        }
        // Récupération du total des offres pour la pagination
        if (classement) {
            [{ total }] = await queryDB(`SELECT COUNT(*) as total FROM offres WHERE status = 'publier' AND JSON_CONTAINS(classement, ?, '$')`, [JSON.stringify({ slug: classement })]);
        } else if (produit) {
            [{ total }] = await queryDB(`SELECT COUNT(*) as total FROM offres WHERE status = 'publier' AND id_produit = ?`, [produit]);
        }

        // Récupération des offres avec pagination
        const offres = await queryDB(sqlQuery, params);
        return NextResponse.json({ offres, total });
    } catch (error) {
        console.error("Erreur dans GET /offres:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}



export async function POST(request) {
    try {
        const formData = await request.formData(); // Utilise formData() pour récupérer les données du formulaire
        const form = Object.fromEntries(formData); // Convertit formData en objet pour un accès facile

        // Validation des champs obligatoires
        const requiredFields = ["title", "classement", "descriptionOC", "lien"];
        for (let field of requiredFields) {
            if (!form[field]) {
                return NextResponse.json(
                    { message: `Le champ ${field} est requis.` },
                    { status: 400 }
                );
            }
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

        // Conversion des objets en JSON si nécessaire (classement et descriptionOC)
        const classementStr = form.classement ? JSON.stringify(JSON.parse(form.classement)) : null;
        // const descriptionOCStr = form.descriptionOC ? JSON.stringify(JSON.parse(form.descriptionOC)) : null;

        const sql = `
            INSERT INTO offres 
            (title, slug, classement, descriptionOC, image, prix, reduction, lien, id_produit, indexation, content, meta_title, meta_description, responsable)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            JSON.parse(form.title),
            JSON.parse(form.slug),
            classementStr,
            JSON.parse(form.descriptionOC),
            imagePublicPath == '' ? JSON.parse(form.image) : imagePublicPath,
            JSON.parse(form.prix) || 0,
            JSON.parse(form.reduction) || 0,
            JSON.parse(form.lien),
            slugify(JSON.parse(form.produit)) || null,
            JSON.parse(form.indexation) == true ? 1 : 0, // Si indexation est coché, il doit être 1
            JSON.parse(form.content),
            JSON.parse(form.meta_title),
            JSON.parse(form.meta_description),
            JSON.parse(form.responsable),
        ];

        await queryDB(sql, values);

        return NextResponse.json(
            { message: "Offre ajoutée avec succès" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur dans POST /offres:", error);
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}
