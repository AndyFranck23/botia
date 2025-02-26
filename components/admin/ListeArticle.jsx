'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ListeArticle = () => {
    const [blog, setBlog] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlog()
    }, [])

    const fetchBlog = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`)
            const blogs = await response.json()
            setBlog(blogs)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${id}`)
            fetchBlog()
            alert(response.data.message)
            // window.location.reload()
        } catch (error) {
            console.error("Erreur de suppression:", error)
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
            <h1>Liste des Pages</h1>
            <ul>
                {blog?.map((article) => (
                    <li key={article.id}>
                        <div className="flex justify-around">
                            <p>{article.title}</p>
                            <div className="flex space-x-1">
                                <a href={`/admin/blog/modifier-article/${article.id}`} className='text-blue-500'>Modifier</a>
                                <button onClick={() => handleDelete(article.id)} className='text-red-500'>Supprimer</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListeArticle