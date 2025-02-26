'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export const ListeDemand = () => {
    const [loading, setLoading] = useState(true)
    const [demandes, setDemandes] = useState([])

    useEffect(() => {
        listeDemand()
    }, [])

    const listeDemand = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/demande`)
            const users = await response.json()  // Correction: ajouter await ici
            setDemandes(users)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const deleteDemande = async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/demande/${id}`)
            setDemandes(demandes.filter((demande) => demande.id !== id))
        } catch (err) {
            console.log(err.message)
        }
    }

    const agreeDemande = async (id) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/demande/${id}`)
            listeDemand()
        } catch (err) {
            console.log(err.message)
        }
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )

    return (
        <div className="text-black">
            <p className='text-xl font-medium mb-5'>Liste des demandes</p>
            <div className="space-y-5">
                {
                    demandes.map((user, index) => (
                        <Demande
                            key={index}
                            userData={user}
                            onClickAdd={() => agreeDemande(user.id)}
                            onClickDel={() => deleteDemande(user.id)}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export const Demande = ({ userData, onClickAdd, onClickDel }) => {
    return (
        <div className='text-black border-gray-200 border-2 p-3 space-y-2 rounded-md hover:bg-gray-200 active:border-blue-500'>
            <div className="flex items-center w-full justify-between">
                <h1 className='text-lg font-medium text-blue-500'>{userData.identite}</h1>
                <div className="space-x-3">
                    <button className='text-blue-400' onClick={onClickAdd}>
                        Accepter
                    </button>
                    <button className='text-red-400' onClick={onClickDel}>
                        Supprimer
                    </button>
                </div>
            </div>
            <div className="flex">
                <div className="w-full">
                    <p>
                        <span className='font-medium text-gray-700'>Rôle: </span>
                        {userData.role}
                    </p>
                    <p>
                        <span className='font-medium text-gray-700'>E-mail: </span>
                        {userData.email}
                    </p>
                </div>
                <div className="flex w-full justify-end items-end">
                    <p>
                        <span className='font-medium text-gray-700'>Date: </span>
                        {userData.date}
                    </p>
                </div>
            </div>
        </div>
    )
}
