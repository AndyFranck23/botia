// /app/api/signUp/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { queryDB } from '@/lib/db';

export async function POST(request) {
    try {
        // Récupérer les données du corps de la requête
        const { form } = await request.json();

        // Vérifier si l'email est déjà utilisé
        const sqlSelect = 'SELECT * FROM users WHERE email = ?';
        const existingUsers = await queryDB(sqlSelect, [form.email]);

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { message: "L'email est déjà utilisé" },
                { status: 400 }
            );
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(form.password, 10);

        // Insertion des données dans la base
        const sqlInsert =
            'INSERT INTO users (identite, role, email, autorisation, date, password) VALUES (?, ?, ?, ?, ?, ?)';
        await queryDB(sqlInsert, [
            form.identite,
            form.role,
            form.email,
            form.autorisation,
            form.date,
            hashedPassword,
        ]);

        return NextResponse.json({ message: 'Inscription réussi' }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return NextResponse.json(
            { message: 'Erreur du serveur' },
            { status: 500 }
        );
    }
}
