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
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Liste des Types</h2>

            <div className="space-y-4">
                {classements.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 border rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-blue-600 font-semibold text-lg">{item.title}</p>
                            <div className="space-x-3">
                                <Link
                                    href={`/admin/type/updatetype/${item.id}`}
                                    className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition"
                                >
                                    Modifier
                                </Link>
                                {/* <button
                                    className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Supprimer
                                </button> */}
                            </div>
                        </div>

                        {/* Section pour les sous-classements */}
                        {item.classement?.length > 0 && (
                            <div className="mt-3 pl-5 border-l-4 border-blue-300">
                                <h3 className="text-gray-700 font-medium text-md">Classements associés :</h3>
                                <ul className="list-disc pl-4 text-gray-600">
                                    {item.classement.map((elt) => (
                                        <li key={elt.id}>{elt.title}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListeType
