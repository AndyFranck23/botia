import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import HeaderAdmin from '@/components/admin/HeaderAdmin'
import { MenuAdmin } from '@/components/admin/MenuAdmin'

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const LOGIN_ADMIN = process.env.LOGIN_ADMIN

export default async function Layout({ children }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value

    if (!token) {
        redirect('/login')
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [decoded.email]
        )

        if (user.length === 0) {
            redirect('/login')
        }
        const out = user[0].email == LOGIN_ADMIN

        // const isAdmin = decoded.email === process.env.LOGIN_ADMIN

        return (
            <>
                <HeaderAdmin userdata={user[0]} userType={out} />
                <MenuAdmin className={'sm:block hidden'} userType={out} />
                <div className="sm:ml-40 text-white text-sm sm:text-md h-screen pt-10">
                    <div className="w-full p-6 shadow-md rounded-lg md:flex justify-center">
                        <div className="md:w-[600px] lg:w-[900px] ">
                            {children}
                        </div>
                    </div>
                </div>
            </>
        )

    } catch (error) {
        console.error('Token verification failed:', error)
        redirect('/login')
    }
}