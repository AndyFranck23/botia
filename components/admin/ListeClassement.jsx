'use client'
import React, { useState } from 'react'
// import axios from 'axios'
import { useSearchParams } from 'next/navigation'

const ListeClassement = ({ classement }) => {
    const { type } = useSearchParams()
    console.log(type)
    // const [list, setList] = useState(classement) // État local

    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements/${id}`)
    //         setList(list.map(item => ({
    //             ...item,
    //             classement: item.classement.filter(elt => elt.id !== id)
    //         })))
    //     } catch (error) {
    //         console.error("Erreur de suppression:", error)
    //     }
    // }

    return (
        <div className="text-black">
            {/* {list.map(item =>
                <div key={item.id} className=""> */}
            {/* <h1 className="text-blue-500 text-500">{item.title}</h1> */}
            {classement.map(elt =>
                <div key={elt.id} className="flex w-full justify-between">
                    <p>{elt.title}</p>
                    <div className="space-x-2">
                        {/* <button onClick={() => handleDelete(elt.id)} className="text-red-500">supprimer</button> */}
                        <a href={`/admin/type/updateclassement/${elt.id}`} className="text-blue-500">modifier</a>
                    </div>
                </div>
            )}
            {/* </div>
            )} */}
        </div>
    )
}

export default ListeClassement
