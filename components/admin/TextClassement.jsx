'use client'
import React, { useEffect, useState } from 'react'
import { NOM_DE_DOMAIN } from '../env'
import { MyInput } from '@/app/signup/page'
import axios from 'axios'

const TextClassement = () => {
    const [produit, setProduit] = useState([])
    const [classements, setClassements] = useState([])
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        produit: '', // Changé de 'title' à 'title' pour correspondre à l'API
        classement: '',
        title: '',
        description: ''
    })


    useEffect(() => {
        const fetchProduit = async () => {
            try {
                const response = await fetch(`${NOM_DE_DOMAIN}/api/produit`)
                const response2 = await fetch(`${NOM_DE_DOMAIN}/api/classements`)
                const data = await response.json()
                const data2 = await response2.json()
                setProduit(data)
                setClassements(data2)
            } catch (err) {
                setMessage('tsy mety')
            }
        }
        fetchProduit()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title) {
            setMessage('Veuillez remplir le champ title')
            return
        }

        try {
            const response = await axios.post(`${NOM_DE_DOMAIN}/api/titre`, {
                produit: form.produit, classement: form.classement, title: form.title, description: form.description    // On envoie seulement le title à l'API
            })

            setMessage(response.data.message)
            // setForm({ title: '', image: '' }) // Réinitialisation du formulaire
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur serveur")
        }
        // finally {
        //     window.location.reload()
        // }
    }

    return (
        <div className='text-black'>
            <h1 className='text-center text-2xl font-medium mb-10'>Ajouter un titre produit</h1>
            <form onSubmit={handleSubmit} className="space-y-2 text-md text-gray-700 font-medium">
                <div className="sm:mb-5 mb-2">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Produit</label>
                    <select
                        value={form.produit}
                        onChange={(e) => setForm({ ...form, produit: e.target.value })}
                        className={`${form.type === '' ? 'text-gray-400' : 'text-gray-700'} block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}>
                        <option className='hidden' value="">Produit du classement ou le titre appartient</option>
                        {produit.map((type, index) => (
                            <option key={index} className='text-gray-700' value={type.title}>{type.title}</option>
                        ))}
                    </select>
                </div>
                <div className="sm:mb-5 mb-2">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Classement</label>
                    <select
                        value={form.classement}
                        onChange={(e) => setForm({ ...form, classement: e.target.value })}
                        className={`${form.type === '' ? 'text-gray-400' : 'text-gray-700'} block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}>
                        <option className='hidden' value="">Classement ou le titre appartient</option>
                        {classements.map((type, index) => (
                            <option key={index} className='text-gray-700' value={type.title}>{type.title}</option>
                        ))}
                    </select>
                </div>
                <MyInput
                    label={"Titre"}
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <div className="">
                    <label className=" mb-2 font-medium text-gray-700 ">Description</label>
                    <textarea onChange={(e) => setForm({ ...form, description: e.target.value })} value={form.description} className="mb-5 w-full outline-none border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-700 h-[100px] sm:h-[200px] p-2  " />
                </div>
                <div className="w-full justify-end flex">
                    <button
                        type="submit"
                        className='bg-blue-500 p-2 rounded-md px-5 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-violet-300'
                    >
                        Ajouter
                    </button>
                </div>
            </form>
            {message && (
                <p className={`mt-4 text-center ${message.includes('Erreur') ? 'text-red-400' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}

export default TextClassement