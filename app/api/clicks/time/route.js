import { queryDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const timeline = await queryDB(`
            SELECT DATE(date) as date, COUNT(id) as clicks
            FROM clicks
            GROUP BY DATE(date)
            ORDER BY date ASC
          `, []);

        return NextResponse.json(timeline);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur lors de la récupération des données" });
    }
}
