'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

const ListeClassement = ({ classement }) => {
    const { type } = useSearchParams()
    console.log(type)

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Liste des classements</h2>

            <div className="divide-y divide-gray-200">
                {classement.map(elt => (
                    <div key={elt.id} className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 rounded-lg transition">
                        <p className="text-gray-700 font-medium">{elt.title}</p>
                        <a
                            href={`/admin/type/updateclassement/${elt.id}`}
                            className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition"
                        >
                            Modifier
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListeClassement
