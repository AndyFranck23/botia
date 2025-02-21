'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MyInput } from '@/app/signup/page'
import { NOM_DE_DOMAIN } from '../env'
import { handleImageSelect } from '../LogoutButton'

const ModifierType = ({ id }) => {
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [imageType, setImageType] = useState('url') // 'url' ou 'upload'
    const [imageFile, setImageFile] = useState(null) // Pour stocker le fichier uploadé
    const [form, setForm] = useState({
        title: '',
        image: ''
    })

    useEffect(() => {
        handleType()
    }, [])

    const handleType = async () => {
        try {
            const response = await fetch(`${NOM_DE_DOMAIN}/api/types/${id}`)
            const type = await response.json()
            setForm({ title: type[0].title, image: type[0].image })
        } catch (e) {
            setMessage(e.response.message.json())
        } finally {
            setLoading(false)
        }
    }

    const submit = async () => {
        if (form.title !== '') {
            try {
                const formData = new FormData();
                Object.keys(form).forEach(key => {
                    formData.append(key, form[key]);
                });
                if (imageType === 'upload' && imageFile) {
                    formData.append('file', imageFile);
                }
                const response = await axios.put(`${NOM_DE_DOMAIN}/api/types/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                alert(response.data.message);
                setMessage(response.data.message)
            } catch (e) {
                setMessage(e.response.data.error)
            }
        } else {
            setMessage('Veuillez remplir tous les champs')
        }
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )

    return (
        <div className='text-black'>
            <h1 className='text-center text-2xl font-medium mb-10'>Modifier un type de classement</h1>
            <form onSubmit={submit} className="space-y-2 text-md text-gray-700 font-medium">
                <MyInput
                    label={"Titre du type"}
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <div className="">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">
                        Image
                    </label>
                    <div className="mb-1">
                        <select
                            value={imageType}
                            onChange={(e) => setImageType(e.target.value)}
                            className="block px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500">
                            <option value="url">URL</option>
                            <option value="upload">Upload</option>
                            <option value="select">Select</option>
                        </select>
                    </div>
                    <div className="">
                        {imageType === 'url' && (
                            <MyInput type={'text'} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                        )}
                        {imageType === 'upload' && (
                            <div className="mb-5">
                                {/* <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Upload d'image</label> */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                                />
                            </div>
                        )}

                        {imageType === 'select' && (
                            <div className="mb-5">
                                {/* <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Sélectionner une image depuis 'uploads'</label> */}
                                {
                                    form.image == '' ?
                                        <button
                                            type="button"
                                            onClick={() => handleImageSelect(setForm, form)} // Fonction pour afficher la galerie d'images
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500">
                                            Choisir une image
                                        </button> :
                                        <MyInput type={'text'} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                                }
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full justify-end flex">
                    <button
                        type="submit"
                        className='bg-blue-500 p-2 rounded-md px-5 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-violet-300'
                    >
                        Modifier
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

export default ModifierType