'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MyInput } from '@/app/signup/page'
import { NOM_DE_DOMAIN } from '../env'

const ModifierType = ({ id }) => {
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
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
                const response = await axios.put(`${NOM_DE_DOMAIN}/api/types/${id}`, { title: form.title, image: form.image })
                setMessage(response.data.message)
                console.log(response.data)
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
            <div className="space-y-2 text-md text-gray-700 font-medium">
                <MyInput label={"Titre"} type={'text'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <MyInput label={"URL de l'image"} type={'text'} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <div className="w-full justify-end flex">
                    <button onClick={submit} type='submit' className='bg-blue-500 p-2 rounded-md px-5 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-violet-300'>
                        Modifier
                    </button>
                </div>
            </div>
            <p className='flex justify-center text-red-400'>{message}</p>
        </div>
    )
}

export default ModifierType