'use client'

import React, { useEffect, useRef, useState } from 'react'
import { handleImageBrowser } from '../LogoutButton';
import dynamic from "next/dynamic";
import { NOM_DE_DOMAIN } from '../env';
import axios from 'axios';
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });


const ModifierArticle = ({ data, TINY_KEY, id }) => {
    const [message, setMessage] = useState('')
    const editorRef = useRef(null);
    const [title, setTitle] = useState(data?.title);

    // const correctedContent = data?.content
    //     ? data.content.replace(/\.\.\/\.\.\/uploads\//g, '/uploads/')
    //     : "";

    const submit = async () => {
        const content = editorRef.current.getContent();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', JSON.stringify(content))
            const response = await axios.put(`${NOM_DE_DOMAIN}/api/blog/${id}`, formData, {
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full mb-2 text-black"
            />
            <Editor
                apiKey={TINY_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={data.content}
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
                    document_base_url: NOM_DE_DOMAIN,
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
            <button onClick={submit} className="mt-4 bg-blue-500 text-white px-4 py-2">Enregistrer</button>
            <p className='mt-5 flex justify-center text-red-400'>{message}</p>
        </div>
    )
}

export default ModifierArticle