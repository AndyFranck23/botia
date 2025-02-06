'use client'
import React from 'react'
// import { fetchCombinedData } from '../Header'
import axios from 'axios'
import { NOM_DE_DOMAIN } from '../env'
import { getData } from '../Header'

const ListeClassement = () => {
    const { data: classement, loading } = getData();

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${NOM_DE_DOMAIN}/api/classements/${id}`)
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
        <div className="text-black">
            {
                classement.map(item =>
                    <div key={item.id} className="">
                        <h1 className="text-blue-500 text-500">{item.title} </h1>
                        {
                            item.classement.map(elt =>
                                <div key={elt.id} className="flex w-full justify-between">
                                    <p> {elt.title}</p>
                                    <div className="space-x-2">
                                        <button onClick={() => handleDelete(elt.id)} className="text-red-500">supprimer</button>
                                        <a href={`/admin/type/updateclassement/${elt.id}`} className="text-blue-500">modifier</a>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ListeClassement