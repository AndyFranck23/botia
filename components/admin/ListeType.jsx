'use client'
import axios from 'axios'
import Link from 'next/link'

const ListeType = ({ classements }) => {

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types/${id}`)
            alert(response.data.message)
        } catch (error) {
            console.error("Erreur de suppression:", error)
        } finally {
            window.location.reload()
        }
    }

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
                            {/* <button
                                className='text-red-500 hover:underline'
                                onClick={() => handleDelete(item.id)}
                            >
                                Supprimer
                            </button> */}
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