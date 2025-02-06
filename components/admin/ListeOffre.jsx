'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NOM_DE_DOMAIN } from '../env'

const ListeOffre = ({ produit }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchOffre()
    }, [])

    const fetchOffre = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${NOM_DE_DOMAIN}/api/offres${produit ? '?produit=' + produit.toLowerCase() : ''}`)
            const offres = await response.json()
            setData(offres)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${NOM_DE_DOMAIN}/api/offres/${id}`)
            fetchOffre()
            // window.location.reload()
        } catch (error) {
            console.error("Erreur de suppression:", error)
        }
    }

    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    return (
        <div className='text-black'>
            <div className="flex items-center justify-between mb-5">
                <h1 className='flex justify-center text-xl font-medium'>Liste des offres publié</h1>
                <div className="space-x-2 flex items-center justify-center">
                    <button type='submit' className='bg-blue-500 text-white text-lg p-2 rounded-[50px] active:border-white w-[35px] h-[35px] flex items-center justify-center border-blue-400 border-2'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className='border-2 border-gray-200 h-[35px] sm:w-[200px] w-[30vw] rounded-2xl p-2 outline-none focus:border-blue-500' placeholder='Recherche' />
                </div>
            </div>
            <div className="space-y-5">
                {
                    filteredData.length == 0 ?
                        <div className="text-black w-full items-center flex justify-center">Aucun résultat</div>
                        :
                        filteredData.map((offre, index) =>
                            <Offre key={index} data={offre} onClickUpdate={`/admin/offre/modifieroffre/${offre.id}`} onClickDel={() => handleDelete(offre.id)} />
                        )
                }
            </div>
        </div>
    )
}

export default ListeOffre

const Offre = ({ data, onClickUpdate, onClickDel }) => {
    return (
        <div className="xs:flex p-3 rounded-md justify-between items-center border-gray-200 border-2 hover:bg-gray-200">
            <img src={data.image} alt="" className='hidden sm:block h-[100px] w-[100px] object-cover rounded-md' />
            <div className="">
                <h1 className='text-blue-500 font-medium'>{data.title} </h1>
                <div className="flex space-x-1 w-[200px]">
                    <p className='text-gray-700 font-medium mb-2 text-sm sm:text-md'>Description: </p>
                    {
                        JSON.parse(data.descriptionOC).map((elt, index) =>
                            index <= 1 ? <p key={index}>{elt}</p> : ''
                        )
                    }
                    {
                        JSON.parse(data.descriptionOC).length > 2 && <p>...</p>
                    }
                </div>
                <div className="flex space-x-1 w-[200px]">
                    <p className='text-gray-700 font-medium mb-2 text-sm sm:text-md'>Classements: </p>
                    {
                        JSON.parse(data.classement).map((elt, index) =>
                            index <= 1 ? <p key={index}>{elt}</p> : ''
                        )
                    }
                    {
                        JSON.parse(data.classement).length > 2 && <p>...</p>
                    }
                </div>
            </div>
            <div className="">
                <div className="flex space-x-1">
                    <a href={onClickUpdate} className='text-blue-500'>Modifier</a>
                    <button onClick={onClickDel} className='text-red-500'>Supprimer</button>
                </div>
                <div className="">
                    <p className='mb-2 text-sm sm:text-md'><span className='text-gray-700 font-medium '>Prix:</span>  {data.prix} $</p>
                    <p className='mb-2 text-sm sm:text-md'><span className='text-gray-700 font-medium '>Réduction:</span>  {data.reduction} %</p>
                </div>
            </div>
        </div>
    )
}