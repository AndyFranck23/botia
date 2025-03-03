'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MyInput } from './SignUp'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (response.ok) {
                if (data.user.autorisation === 1 || data.user.admin == true) {
                    router.push('/admin')
                } else {
                    setError("Vous venez de vous inscrire, votre demande doit passer par l'administration");
                }
            } else {
                setError(data.message || 'Erreur de connexion')
            }
        } catch (err) {
            setError('Erreur de communication avec le serveur')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <MyInput
                        type="email"
                        value={email}
                        label="Adresse e-mail"
                        onChange={(e) => setEmail(e.target.value)}

                    />
                </div>

                <div className="mb-6">
                    <MyInput
                        type="password"
                        label="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Se connecter
                </button>
                <div className="pt-5">
                    <p>Vous n'avez pas encore de compte ? <Link className='text-blue-500' href={'/signup'}>S'incrire</Link></p>
                </div>
            </form>
        </div>
    )
}