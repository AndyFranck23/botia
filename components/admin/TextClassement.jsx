'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MyInput } from '@/app/signup/page'
import axios from 'axios'
import dynamic from "next/dynamic";
import { handleImageBrowser } from '../LogoutButton';
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });

const TextClassement = ({ TINY_KEY }) => {
    const editorRef = useRef(null);
    const [classements, setClassements] = useState([])
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        titre_h1: '',
        classement: '',
        title: '',
        description: '',
        meta_title: '',
        meta_description: '',
        content: ''
    })


    useEffect(() => {
        const fetchClassement = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`)
                const data = await response.json()
                setClassements(data)
                console.log(data)
            } catch (err) {
                setMessage('tsy mety')
            }
        }
        fetchClassement()
    }, [])

    const fetchClassName = async (e) => {
        const data = classements.filter(item => item.title == e.target.value)
        setForm({
            classement: e.target.value,
            titre_h1: data[0].titre_h1,
            title: data[0].sous_titre,
            description: data[0].text,
            meta_title: data[0].meta_title,
            meta_description: data[0].meta_description,
            content: data[0].content
        })
    }

    const handleSubmit = async () => {
        const content = editorRef.current.getContent();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });
            formData.append('content', JSON.stringify(content))
            const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/titre`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message)
            alert(response.data.message)
        } catch (error) {
            setMessage(error.response?.data?.error || "Erreur serveur")
        }
    }

    return (
        <div className='text-black'>
            <h1 className='text-center text-2xl font-medium mb-10'>Enregistrer un titre classement</h1>
            {/* <form onSubmit={handleSubmit} className="space-y-2 text-md text-gray-700 font-medium"> */}
            <div className="sm:mb-5 mb-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Classement</label>
                <select
                    value={form.classement}
                    onChange={(e) => fetchClassName(e)}
                    className={`${form.classement === '' ? 'text-gray-400' : 'text-gray-700'} block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}>
                    <option className='hidden' value="">Classement ou le titre appartient</option>
                    {classements.map((type, index) => (
                        <option key={index} className='text-gray-700' value={type.title}>{type.title}</option>
                    ))}
                </select>
            </div>
            {
                form.classement != '' &&
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
                    <Editor
                        apiKey={TINY_KEY}
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={form.content}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                "image", "fullscreen", "table", "wordcount", "code", "link",
                                //  "autoresize"
                                "powerpaste",
                                "lists", "advlist"
                            ],
                            toolbar:
                                "undo redo | formatselect | bold italic | forecolor backcolor emoticons | \
                                                   alignleft aligncenter alignright alignjustify | \
                                                   bullist numlist outdent indent | removeformat | help | \
                                                   link image media | codesample emoticons | print fullscreen preview | \
                                                   ",
                            images_upload_url: `/api/upload`,
                            document_base_url: process.env.NEXT_PUBLIC_SITE_URL,
                            relative_urls: false,
                            automatic_uploads: true,
                            file_picker_types: "image media",
                            file_picker_callback: handleImageBrowser,
                            image_advtab: true,
                            image_title: true,
                            image_description: true,
                            paste_as_text: false, // Ne pas convertir le texte en texte brut
                            paste_word_valid_elements: "b,strong,i,em,u,a,span,div,p", // Conserver certains styles de Word
                            paste_word_cleanup_mode: "keep", // Conserver tous les styles du Word
                            paste_data_images: true,
                            paste_preprocess: function (plugin, args) {
                                // Traiter le contenu avant le collage
                                console.log("Prétraitement du collage", args.content);
                            },
                            paste_postprocess: function (plugin, args) {
                                // Traiter le contenu après le collage
                                console.log("Post-traitement du collage", args.content);
                            },
                        }}
                    />
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
                            // type="submit"
                            onClick={handleSubmit}
                            className='bg-blue-500 p-2 rounded-md px-5 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-violet-300'
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            }
            {/* </form> */}
            {message && (
                <p className={`mt-4 text-center ${message.includes('Erreur') ? 'text-red-400' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}

export default TextClassement