'use client'

import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { nombrePage } from '../Slug'

const ListeOffre = ({ data, total }) => {
    const [search, setSearch] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()

    // Récupérer la page actuelle depuis l'URL (défaut 1)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = nombrePage // Nombre d'éléments par page
    const totalPages = Math.ceil(total / itemsPerPage)

    useEffect(() => {
        const page = parseInt(searchParams.get("page"), 10) || 1
        if (page !== currentPage) {
            setCurrentPage(page)
        }
    }, [searchParams, currentPage])

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            const params = new URLSearchParams(searchParams)
            params.set("page", page)
            params.set("limit", itemsPerPage)
            router.push(`?${params.toString()}`, { scroll: false })
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres/${id}`)
            alert(response.data.message)
            router.refresh()
        } catch (error) {
            console.error("Erreur de suppression:", error)
        }
    }

    const handleBroullion = async (id) => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/broullion/${id}`)
            alert(response.data.message)
            router.refresh()
        } catch (error) {
            console.error("Erreur de mise en brouillon:", error)
        }
    }

    const filteredData = data?.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div className='text-black'>
                <div className="flex items-center justify-between mb-5">
                    <h1 className='flex justify-center text-xl font-medium'>Liste des offres publiées</h1>
                    <div className="space-x-2 flex items-center justify-center">
                        <button
                            type='submit'
                            className='bg-blue-500 text-white text-lg p-2 rounded-full w-9 h-9 flex items-center justify-center border-blue-400 border-2'
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='border-2 border-gray-200 h-9 sm:w-48 w-[30vw] rounded-2xl p-2 outline-none focus:border-blue-500'
                            placeholder='Recherche'
                        />
                    </div>
                </div>
                <div className="space-y-5">
                    {filteredData?.length === 0 ? (
                        <div className="text-black w-full flex justify-center">Aucun résultat</div>
                    ) : (
                        filteredData.map((offre, index) => (
                            <Offre
                                key={index}
                                data={offre}
                                onClickBro={() => handleBroullion(offre.id)}
                                onClickUpdate={`/admin/offre/modifieroffre/${offre.id}`}
                                onClickDel={() => handleDelete(offre.id)}
                            />
                        ))
                    )}
                </div>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between mt-10">
                    {currentPage > 1 && (
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Précédents
                        </button>
                    )}
                    {currentPage < totalPages && (
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Voir plus
                        </button>
                    )}
                </div>
            )}
        </>
    )
}

export default ListeOffre

const Offre = ({ data, onClickUpdate, onClickDel, onClickBro }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsActive(true)}
                className="xs:flex p-3 rounded-md justify-between items-center border-gray-200 border-2 hover:bg-gray-200">
                <img
                    src={data?.image || data?.title}
                    alt=""
                    className='hidden sm:block h-24 w-24 object-cover rounded-md'
                />
                <div>
                    <h1 className='text-blue-500 font-medium'>{data?.title}</h1>
                    <div className="flex space-x-1 w-48">
                        <p className='text-gray-700 font-medium mb-2 text-sm sm:text-md'>Description:</p>
                        <span>
                            {data?.descriptionOC.length > 15
                                ? data?.descriptionOC.substring(0, 15) + '...'
                                : data?.descriptionOC}
                        </span>
                    </div>
                    <div className="flex space-x-1 w-48">
                        <p className='text-gray-700 font-medium mb-2 text-sm sm:text-md'>Classements:</p>
                        {JSON.parse(data?.classement || "[]").slice(0, 2).map((elt, index) => (
                            <p key={index}>{elt.title}</p>
                        ))}
                        {JSON.parse(data?.classement || "[]").length > 2 && <p>...</p>}
                    </div>
                    <p>{data?.date}</p>
                </div>
                <div>
                    <div className="flex space-x-3">
                        <a href={onClickUpdate} onClick={(e) => e.stopPropagation()} className='text-blue-500'>
                            <i className="fa-solid fa-pen-to-square text-lg"></i>
                        </a>
                        <button onClick={(e) => { e.stopPropagation(); onClickDel(); }} className='text-red-500'>
                            <i className="fa-regular fa-trash-can text-lg"></i>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onClickBro(); }} className='text-blue-500'>Brouillon</button>
                    </div>
                    <div>
                        <p className='mb-2 text-sm sm:text-md'>
                            <span className='text-gray-700 font-medium'>Prix:</span> {data?.prix}
                        </p>
                        <p className='mb-2 text-sm sm:text-md'>
                            <span className='text-gray-700 font-medium'>Réduction:</span> {data?.reduction} %
                        </p>
                    </div>
                    <p>{data?.responsable}</p>
                </div>
            </div>
            {isActive && <ChatbotModal data={data} onClose={() => setIsActive(false)} />}
        </>
    )
}

const ChatbotModal = ({ data, onClose }) => {
    // const prod =

    return (
        <>
            <div
                onClick={onClose}
                className="fixed top-0 left-0 m-0 p-0 h-screen w-screen z-20 bg-black opacity-50"
            ></div>
            <div className="z-20 top-[45%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] fixed">
                <div className="">
                    <div className="flex gap-[3vw]">
                        <button onClick={onClose} className='text-white text-3xl z-20 w-12 h-12 flex justify-center items-center rounded-[100%] bg-black/60 ml-[-2vw]'><i className="fa-solid fa-xmark"></i></button>
                        <a href={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.id_produit}/${data?.slug}`} className='text-white text-2xl z-20 w-12 h-12 flex justify-center items-center rounded-[100%] bg-black/60 ml-[-2vw]'><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                    <div className={`bg-white grid grid-rows-[auto_50px] hover:scale-102 transition-all duration-300  hover:border-blue-600 border border-blue-100 rounded-xl shadow-lg my-3 w-[90vw] lg:w-[600px] xs:w-[400px]`}>
                        <div className="">
                            <div>
                                {/* Image en pleine largeur  */}
                                <div className="w-full">
                                    <img src={data?.image ? data?.image : data?.title} className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300" alt={data.title} />
                                </div>
                            </div>
                            <div className="flex p-4 w-full justify-between">
                                <div>
                                    <h2 className='text-2xl font-bold text-gray-800 group-hover:text-white w-full'>{data.title}</h2>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-xl border font-bold text-green-600 flex justify-end">
                                    {
                                        data?.id_produit
                                    }
                                </div>
                            </div>

                            {/* Section description de l'offre court */}
                            <div>
                                <div className="w-full pb-3">
                                    <p className='font-medium text-sm text-gray-700 px-3 py-1 rounded-lg inline-flex items-center justify-center text-center'>
                                        {data?.descriptionOC}
                                    </p>
                                </div>
                            </div>

                            {/* Section tous les classements */}
                            <div className="px-4 flex flex-wrap gap-2 list-none w-full text-white text-xs sm:text-sm">
                                {JSON.parse(data?.classement).map((item, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-1 text-sm border-2 border-blue-200 text-blue-600 rounded-full group-hover:border-white/50 group-hover:text-white hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className=" border border-blue-100 rounded-b-xl grid place-items-center">
                            <div className="text-xs sm:text-sm " >
                                <p className='text-xl text-gray-800 font-medium'>A partir de {data?.prix}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};