'use client'

import { useState } from 'react'
import axios from 'axios'
import { MyInput } from "./SignUp";
import { handleImageSelect } from '../LogoutButton'

const AddType = () => {
    const [message, setMessage] = useState('')
    const [imageType, setImageType] = useState('url') // 'url' ou 'upload'
    const [imageFile, setImageFile] = useState(null) // Pour stocker le fichier uploadé
    const [form, setForm] = useState({
        title: '', // Changé de 'title' à 'title' pour correspondre à l'API
        image: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title) {
            setMessage('Veuillez remplir le champ title')
            return
        }

        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });
            if (imageType === 'upload' && imageFile) {
                formData.append('file', imageFile);
            }
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            alert(response.data.message);
            setMessage(response.data.message)
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur serveur")
        } finally {
            setForm({ title: '', image: '' }) // Réinitialisation du formulaire
        }
    }

    return (
        <div className='text-black'>
            <h1 className='text-center text-2xl font-medium mb-10'>Ajouter un type de classement</h1>
            <div className="space-y-2 text-md text-gray-700 font-medium">
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
                                            className="block w-[200px] px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500">
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
                        onClick={handleSubmit}
                        className='bg-blue-500 p-2 rounded-md px-5 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-violet-300'
                    >
                        Ajouter
                    </button>
                </div>
            </div>
            {message && (
                <p className={`mt-4 text-center ${message.includes('Erreur') ? 'text-red-400' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}

export default AddType