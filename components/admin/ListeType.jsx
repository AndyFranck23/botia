'use client'
import axios from 'axios'
import Link from 'next/link'
import { NOM_DE_DOMAIN } from '../env'
import { getData } from '../Header'

const ListeType = () => {
    const { data: classements, loading } = getData();

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${NOM_DE_DOMAIN}/api/types/${id}`)
            // window.location.reload()
        } catch (error) {
            console.error("Erreur de suppression:", error)
        }
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    return (
        <div className='text-black p-4'>
            {classements.map((item) => (
                <div key={item.id} className="mb-4 border-b pb-2">
                    <div className="flex w-full justify-between items-center">
                        <p className='text-blue-500 text-xl'>{item.title}</p>
                        <div className="space-x-3">
                            <Link
                                className='text-blue-500 hover:underline'
                                href={`/admin/type/updatetype/${item.id}`}
                            >
                                Modifier
                            </Link>
                            <button
                                className='text-red-500 hover:underline'
                                onClick={() => handleDelete(item.id)}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                    {/* Section facultative pour les classements enfants */}
                    {item.classement?.length > 0 && (
                        <div className="ml-10 font-medium text-md text-gray-700">
                            <ul>
                                {item.classement.map((elt) => (
                                    <li key={elt.id}>{elt.title}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ListeType