'use client'

import { useEffect, useState } from 'react'
import { NOM_DE_DOMAIN } from '../env'

export const MenuAdmin = ({ className, userType, active }) => {
    const [activeId, setActiveId] = useState(active)
    const [loading, setLoading] = useState(true)
    const [produit, setProduit] = useState([])


    useEffect(() => {
        const fetchProduit = async () => {
            try {
                const response = await fetch(`${NOM_DE_DOMAIN}/api/produit`)
                const data = await response.json()
                setProduit(data)
            } catch (err) {
                setMessage('tsy mety')
            }
        }
        fetchProduit()
        setLoading(false)
    }, [])

    const toggleMenu = (id) => {
        setActiveId(activeId === id ? null : id)
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )

    return (
        <div className={`${className} fixed bg-gray-900 w-48 mt-10 h-full text-white text-sm sm:text-md overflow-y-auto py-4 shadow-lg`}>
            <ul className='space-y-2 list-none touch-pan-y'>

                {/* Menu Comptes */}
                <li>
                    <MyButton
                        disabled={!userType}
                        text={'Comptes'}
                        icon={'fa-regular fa-user'}
                        onClick={() => toggleMenu('compte')}
                        isActive={activeId === 'compte'}
                    />
                    <div className={`overflow-hidden transition-all duration-300 ${activeId === 'compte' ? 'max-h-40' : 'max-h-0'}`}>
                        <MySubButton text={'Tous les comptes'} href={'/admin/comptes/listecompte'} />
                        <MySubButton text={"Demande d'inscription"} href={'/admin/comptes/demande'} />
                    </div>
                </li>

                {/* Menu Offre */}
                <li>
                    <MyButton
                        text={'Offre'}
                        icon={'fa-solid fa-gift'}
                        onClick={() => toggleMenu('offre')}
                        isActive={activeId === 'offre'}
                    />
                    <div className={`overflow-hidden transition-all duration-300 ${activeId === 'offre' ? 'h-auto' : 'max-h-0'}`}>
                        <MySubButton text={'Tous les offres'} href={'/admin/offre/listeoffre'} />
                        {
                            produit.map(item =>
                                <MySubButton key={item.id} text={item.title} href={`/admin/offre/listeoffre/${item.title.toLowerCase()}`} />
                            )
                        }
                        <MySubButton text={'Ajouter un offre'} href={'/admin/offre/addoffre'} />
                    </div>
                </li>

                {/* Menu Classement */}
                <li>
                    <MyButton
                        text={'Classement'}
                        icon={'fa-solid fa-chart-line'}
                        onClick={() => toggleMenu('classement')}
                        isActive={activeId === 'classement'}
                    />
                    <div className={`overflow-hidden transition-all duration-300 ${activeId === 'classement' ? 'max-h-40' : 'max-h-0'}`}>
                        <MySubButton text={'Ajouter un type de classement'} href={'/admin/type/addtype'} />
                        <MySubButton text={'Ajouter un classement'} href={'/admin/type/addclassement'} />
                        <MySubButton text={'Tout les classements'} href={'/admin/type/allclassement'} />
                        {/* {
                            // Assurez-vous que 'classements' est bien un tableau avant d'appeler .map()
                            Array.isArray(classements) && classements.map((item, index) =>
                                <MySubButton key={index} text={item.title} href={`/admin/type/${item.title}`} />
                            )
                        } */}
                    </div>
                </li>

                {/* Menu Blog */}
                <li>
                    <MyButton
                        disabled={true}
                        text={'Blog'}
                        icon={'fa-solid fa-newspaper'}
                        onClick={() => toggleMenu('blog')}
                        isActive={activeId === 'blog'}
                    />
                    <div className={`overflow-hidden transition-all duration-300 ${activeId === 'blog' ? 'max-h-40' : 'max-h-0'}`}>
                        <MySubButton text={'Ajouter un article'} href={'/admin/ajoutBlog'} />
                        <MySubButton text={'Tous les articles'} href={'/admin/ToutBlog'} />
                    </div>
                </li>

            </ul>
        </div>
    )
}

const MyButton = ({ text, icon, onClick, isActive, disabled }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`flex items-center justify-start px-4 py-3 w-full font-medium text-left transition-all duration-300
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600 hover:text-white hover:shadow-md'}
        ${isActive ? 'bg-blue-500 text-white border-l-4 border-blue-500' : 'border-l-4 border-transparent'}
      `}
        >
            {icon && <i className={`${icon} mr-3`}></i>}
            {text}
        </button>
    )
}

const MySubButton = ({ text, href }) => {
    return (
        <a
            href={href}
            className="flex items-center px-6 py-2 w-full text-gray-300 transition-all duration-300 hover:bg-gray-700 hover:text-white"
        >
            {text}
        </a>
    )
}
