'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres${produit ? '?produit=' + produit : ''}`)
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
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres/${id}`)
            fetchOffre()
            alert(response.data.message)
            // window.location.reload()
        } catch (error) {
            console.error("Erreur de suppression:", error)
        }
    }
    const handleBroullion = async (id) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/broullion/${id}`)
            fetchOffre()
            alert(response.data.message)
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
                            <Offre key={index} data={offre} onClickBro={() => handleBroullion(offre.id)} onClickUpdate={`/admin/offre/modifieroffre/${offre.id}`} onClickDel={() => handleDelete(offre.id)} />
                        )
                }
            </div>
        </div>
    )
}

export default ListeOffre

const Offre = ({ data, onClickUpdate, onClickDel, onClickBro }) => {
    return (
        <div className="xs:flex p-3 rounded-md justify-between items-center border-gray-200 border-2 hover:bg-gray-200">
            <img src={data.image ? data.image : data.title} alt="" className='hidden sm:block h-[100px] w-[100px] object-cover rounded-md' />
            <div className="">
                <h1 className='text-blue-500 font-medium'>{data.title} </h1>
                <div className="flex space-x-1 w-[200px]">
                    <p className='text-gray-700 font-medium mb-2 text-sm sm:text-md'>Description: </p>
                    {
                        data.descriptionOC
                    }
                </div>
                <div className="flex space-x-1 w-[200px]">
                    <p className='text-gray-700 font-medium mb-2 text-sm sm:text-md'>Classements: </p>
                    {
                        JSON.parse(data.classement).map((elt, index) =>
                            index <= 1 ? <p key={index}>{elt.title}</p> : ''
                        )
                    }
                    {
                        JSON.parse(data.classement).length > 2 && <p>...</p>
                    }
                </div>
                <p>{data.date}</p>
            </div>
            <div className="">
                <div className="flex space-x-3">
                    <a href={onClickUpdate} className='text-blue-500'><i className="fa-solid fa-pen-to-square text-lg"></i></a>
                    <button onClick={onClickDel} className='text-red-500'><i className="fa-regular fa-trash-can text-lg"></i></button>
                    <button onClick={onClickBro} className='text-blue-500'>Broullion</button>
                    {/* <a href={`/admin/offre/voiroffre/${data.id}`} className='text-blue-500'>voir</a> */}
                </div>
                <div className="">
                    <p className='mb-2 text-sm sm:text-md'><span className='text-gray-700 font-medium '>Prix:</span>  {data.prix} $</p>
                    <p className='mb-2 text-sm sm:text-md'><span className='text-gray-700 font-medium '>Réduction:</span>  {data.reduction} %</p>
                </div>
                <p>{data.responsable}</p>
            </div>
        </div>
    )
}