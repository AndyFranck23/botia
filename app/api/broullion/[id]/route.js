import { queryDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(request, { params }) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const { id } = await params
    try {
        await queryDB('UPDATE offres SET status = ? WHERE id = ?', [status ? 'publier' : 'broullion', id])
        return NextResponse.json(
            { message: status ? "Offre publié" : "Offre ajouté au broullion" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur lors de la suppression" },
            { status: 500 }
        )
    }
}