'use client'
import React, { useEffect, useState } from 'react'
import { MyInput } from '@/app/signup/page'
import axios from 'axios'

const TextAccueil = () => {
    const [produit, setProduit] = useState([])
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        produit: '', // Changé de 'title' à 'title' pour correspondre à l'API
        title: '',
        description: '',
        meta_title: '',
        meta_description: '',
        titre_h1: ''
    })


    useEffect(() => {
        const fetchProduit = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`)
                const data = await response.json()
                setProduit(data)
            } catch (err) {
                setMessage('tsy mety')
            }
        }
        fetchProduit()
    }, [])

    const fetchProdName = async (e) => {
        const data = produit.filter(item => item.title == e.target.value)
        setForm({
            produit: e.target.value, // Changé de 'title' à 'title' pour correspondre à l'API
            title: data[0].sous_titre,
            description: data[0].text,
            meta_title: data[0].meta_title,
            meta_description: data[0].meta_description,
            titre_h1: data[0].titre_h1
        })
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit/${form.produit}`, { form })
            setMessage(response.data.message)
            alert(response.data.message)
            // setForm({ title: '', image: '' }) // Réinitialisation du formulaire
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur serveur")
        }
    }

    return (
        < div className='text-black' >
            <h1 className='text-center text-2xl font-medium mb-10'>Enregistrer un titre produit</h1>
            <div className="">
                <div className="sm:mb-5 mb-2">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Produit</label>
                    <select
                        value={form.produit}
                        onChange={(e) => fetchProdName(e)}
                        className={`${form.produit === '' ? 'text-gray-400' : 'text-gray-700'} block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}>
                        <option className='hidden' value="">Produit ou le titre appartient</option>
                        {produit.map((type, index) => (
                            <option key={index} className='text-gray-700' value={type.title}>{type.title}</option>
                        ))}
                    </select>
                </div>
                {
                    form.produit != '' &&
                    <div className="">
                        <MyInput
                            label={"Titre h1"}
                            type="text"
                            value={form.titre_h1}
                            onChange={(e) => setForm({ ...form, titre_h1: e.target.value })}
                        />
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
                        <div className="">
                            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Référencement SEO</label>
                            <div className="ml-10">
                                <MyInput
                                    label={"Titre"}
                                    type="text"
                                    value={form.meta_title}
                                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                />
                                <MyInput
                                    label={"Description"}
                                    type="text"
                                    value={form.meta_description}
                                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="w-full justify-end flex">
                            <button
                                onClick={handleSubmit}
                                className='bg-blue-500 p-2 rounded-md px-5 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-violet-300'
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                }
            </div>
            {
                message && (
                    <p className={`mt-4 text-center ${message.includes('Erreur') ? 'text-red-400' : 'text-green-500'}`}>
                        {message}
                    </p>
                )
            }
        </div >
    )
}

export default TextAccueil