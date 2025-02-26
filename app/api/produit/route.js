import { queryDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title');
        let sql = ''
        let params = []
        if (title) {
            sql = 'SELECT * FROM produit WHERE title = ?'
            params = [title]
        } else {
            sql = 'SELECT * FROM produit'
        }
        const produit = await queryDB(sql, params);
        return NextResponse.json(produit);
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
