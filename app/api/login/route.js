import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export async function POST(request) {
    const { email, password } = await request.json()
    const LOGIN_ADMIN = process.env.LOGIN_ADMIN

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "Mauvais identifiant" },
                { status: 402 }
            )
        }

        const user = rows[0]
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json(
                { message: "Mot de passe incorrect" },
                { status: 401 }
            )
        }

        // Génération du token
        const expiresIn = email === LOGIN_ADMIN ? '48h' : '1h'
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn }
        )

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
            maxAge: email === LOGIN_ADMIN ? 7600 : 3600 // en secondes
        })

        return response

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { message: "Erreur du serveur" },
            { status: 500 }
        )
    }
}