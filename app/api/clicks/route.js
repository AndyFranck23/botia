import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Récupérer les 10 offres les plus cliquées
        const topOffers = await queryDB(`
          SELECT o.title AS page, COUNT(c.id) AS clicks
          FROM offres o
          LEFT JOIN clicks c ON o.id = c.offre_id
          GROUP BY o.id
          ORDER BY clicks DESC
          LIMIT 10
        `);

        // Récupérer le total de clics sur toutes les offres
        const totalClicksResult = await queryDB(`
          SELECT COUNT(id) AS total FROM clicks
        `);
        const totalClicks = totalClicksResult[0].total || 0;

        // Somme des clics pour les top offres
        const topClicksSum = topOffers.reduce((sum, row) => sum + row.clicks, 0);
        const othersClicks = totalClicks - topClicksSum;

        // Si des clics restent, les regrouper dans "Autres"
        if (othersClicks > 0) {
            topOffers.push({ page: "Autres", clicks: othersClicks });
        }

        return NextResponse.json(topOffers);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur lors de la récupération des données" });
    }
}


export async function POST(req) {
    try {
        const body = await req.json(); // Utilise formData() pour récupérer les données du formulaire
        const { offre } = body
        // console.log("test = ", { offre })
        await queryDB("INSERT INTO clicks (offre_id, url) VALUES (?, ?)", [offre.id, offre.lien]);
        return NextResponse.json({ message: "Click ajouter" });
    } catch (error) {
        console.error("Erreur dans POST /offres:", error);
        return NextResponse.json(
            { message: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}
