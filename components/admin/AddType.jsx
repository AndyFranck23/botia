'use client'

import { useState } from 'react'
import axios from 'axios'
import { MyInput } from '@/app/signup/page'
import { NOM_DE_DOMAIN } from '../env'

const AddType = () => {
    const [message, setMessage] = useState('')
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
            const response = await axios.post(`${NOM_DE_DOMAIN}/api/types`, {
                title: form.title, image: form.image    // On envoie seulement le title à l'API
            })

            setMessage(`Type "${form.title}" créé avec succès avec ID: ${response.data.id}`)
            setForm({ title: '', image: '' }) // Réinitialisation du formulaire
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur serveur")
        } finally {
            window.location.reload()
        }
    }

    return (
        <div className='text-black'>
            <h1 className='text-center text-2xl font-medium mb-10'>Ajouter un type de classement</h1>
            <form onSubmit={handleSubmit} className="space-y-2 text-md text-gray-700 font-medium">
                <MyInput
                    label={"Titre du type"}
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <MyInput
                    label={"URL de l'image"}
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
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

export default AddType