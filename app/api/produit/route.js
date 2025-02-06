import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const produit = await queryDB('SELECT * FROM produit');
        return NextResponse.json(produit);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
