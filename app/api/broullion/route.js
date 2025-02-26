import { queryDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const offre = await queryDB('SELECT * FROM offres WHERE status = ?', ['broullion']);
        return NextResponse.json(offre);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}