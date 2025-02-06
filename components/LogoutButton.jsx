'use client'
import { useRouter } from 'next/navigation'
import { NOM_DE_DOMAIN } from './env'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch(`${NOM_DE_DOMAIN}/api/logout`, { method: 'POST' })
        router.push('/login')
    }

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
            Déconnexion
        </button>
    )
}