'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ListeArticle = ({ page }) => {
    const [blog, setBlog] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlog()
    }, [])

    const fetchBlog = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/${page == 'blog' ? 'blog' : 'page'}`)
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
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/${page == 'blog' ? 'blog' : 'page'}/${id}`)
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
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>Liste des {page == 'blog' ? 'articles' : 'pages'}</h1>
            <div className="divide-y divide-gray-200">
                {blog?.map((article) => (
                    <div key={article.id} className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 rounded-lg transition">
                        <p className="text-gray-700 font-medium">{article.title}</p>
                        <div className="flex space-x-1">
                            {
                                page == 'blog' ?
                                    <a href={`/admin/blog/modifier-article/${article.id}`} className='text-blue-500'>Modifier</a> :
                                    <a href={`/admin/page/modifier-page/${article.id}`} className='text-blue-500'>Modifier</a>
                            }
                            <button onClick={() => handleDelete(article.id)} className='text-red-500'>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListeArticle