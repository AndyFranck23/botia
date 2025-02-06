'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NOM_DE_DOMAIN } from '../env'

export const ListeCompte = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchComptes = async () => {
            try {
                const response = await fetch(`${NOM_DE_DOMAIN}/api/compte`)
                const users = await response.json()
                setData(users)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchComptes()
    }, [])

    const deleteCompte = async (id) => {
        try {
            await axios.delete(`${NOM_DE_DOMAIN}/api/compte/${id}`)
            setData((prevData) => prevData.filter((user) => user.id !== id))
        } catch (err) {
            console.error(err.message)
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
            <p className="text-xl font-medium mb-5">Liste des employés</p>
            <div className="space-y-5">
                {data.map((user) => (
                    <Emploier
                        key={user.id}
                        userData={user}
                        onClick={() => deleteCompte(user.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export const Emploier = ({ userData, onClick }) => {
    return (
        <div className="text-black border-gray-200 border-2 p-3 space-y-2 rounded-md hover:bg-gray-200 active:border-blue-500">
            <div className="flex items-center w-full justify-between">
                <h1 className="text-lg font-medium text-blue-500">{userData.identite}</h1>
                <button className="text-red-400" onClick={onClick}>
                    Supprimer
                </button>
            </div>
            <div className="flex">
                <div className="w-full">
                    <p>
                        <span className="font-medium text-gray-700">Rôle: </span>
                        {userData.role}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">e-mail: </span>
                        {userData.email}
                    </p>
                </div>
                <div className="flex w-full justify-end items-end">
                    <p>
                        <span className="font-medium text-gray-700">id: </span>
                        {userData.id}
                    </p>
                </div>
            </div>
        </div>
    )
}
