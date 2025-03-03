'use client'

import React, { useRef, useState } from 'react'
import { handleImageBrowser } from '../LogoutButton';
import dynamic from "next/dynamic";
import axios from 'axios';
import { MyInput } from "./SignUp";
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });


const ModifierArticle = ({ data, id }) => {
    const [message, setMessage] = useState('')
    const editorRef = useRef(null);
    const [form, setForm] = useState({
        title: data?.title || '',
        meta_title: data?.meta_title || '',
        meta_description: data?.meta_description || '',
        indexation: data?.indexation || 1,
    })

    // const correctedContent = data?.content
    //     ? data.content.replace(/\.\.\/\.\.\/uploads\//g, '/uploads/')
    //     : "";

    const submit = async () => {
        const content = editorRef.current.getContent();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });
            formData.append('content', JSON.stringify(content))
            const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message)
            alert(response.data.message)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div>
            <h1 className='flex justify-center text-xl font-medium mb-5 text-black'>Modifier un article</h1>
            <input
                type="text"
                placeholder="Titre de la page"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border p-2 w-full mb-2 text-black"
            />
            <Editor
                // apiKey={TINY_KEY}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={data.content}
                init={{
                    branding: false, // Masque le branding TinyMCE
                    promotion: false, // Désactive les promotions
                    resize: true, // Permet le redimensionnement
                    image_caption: true, // Active les légendes d'images
                    height: 500,
                    menubar: true,
                    plugins: [
                        "image", "fullscreen", "table", "wordcount", "code", "link",
                        //  "autoresize"
                        // "powerpaste",
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
            <div className="items-center flex justify-between p-3">
                <label className=" mb-2 font-medium text-gray-700 ">Indexation de la page (coché si vous voulez indexé la page)</label>
                <input
                    type="checkbox"
                    className="border"
                    checked={form.indexation}
                    onChange={(e) => {
                        console.log(e.target.checked)
                        setForm({ ...form, indexation: e.target.checked ? 1 : 0 })
                    }}
                />
            </div>
            <label className="block text-gray-700 font-medium mb-2 pt-2 text-md border-t-2 border-gray-200">Référencement SEO:</label>
            <div className="flex flex-wrap">
                <div className="flex items-center">
                    <label className="block text-gray-700 font-medium mb-2 pt-2 text-md">Titre:</label>
                    <MyInput type={'text'} value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
                </div>
                <div className="flex items-center">
                    <label className="block text-gray-700 font-medium mb-2 pt-2 text-md">Description:</label>
                    <MyInput type={'text'} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
                </div>
            </div>
            <button onClick={submit} className="mt-4 bg-blue-500 text-white px-4 py-2">Enregistrer</button>
            <p className='mt-5 flex justify-center text-red-400'>{message}</p>
        </div>
    )
}

export default ModifierArticle