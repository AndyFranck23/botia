import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { queryDB } from '@/lib/db'

export async function POST(request) {
    try {
        const timeAdmin = 5; // temps de session d'un administrateur normal
        const timeSuperAdmin = 48; // temps de session d'un super administarteur
        const { email, password } = await request.json()
        const LOGIN_ADMIN = process.env.LOGIN_ADMIN

        // Vérification de l'utilisateur
        const rows = await queryDB('SELECT * FROM users WHERE email = ?', [email])
        if (rows.length === 0) {
            return NextResponse.json({ message: "Mauvais identifiant" }, { status: 402 })
        }

        const user = rows[0]
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 })
        }

        // Définition de la durée de session
        const expiresInSeconds = email === LOGIN_ADMIN ? 3600 * timeSuperAdmin : 3600 * timeAdmin // 48h ou 1h

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: expiresInSeconds }
        )

        // Réponse avec cookie sécurisé
        const response = NextResponse.json({
            message: "Connexion réussie",
            user: {
                admin: email === LOGIN_ADMIN,
                id: user.id,
                role: user.role,
                identite: user.identite,
                email: user.email,
                autorisation: user.autorisation
            }
        })

        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: expiresInSeconds
        })

        return response
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({ message: "Erreur du serveur" }, { status: 500 })
    }
}
