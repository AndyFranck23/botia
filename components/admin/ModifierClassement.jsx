'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { MyInput } from "./SignUp";
import { handleImageBrowser, handleImageSelect } from '../LogoutButton'

import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });


const ModifierClassement = ({ id, userdata }) => {
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [types, setTypes] = useState([]);
    const [imageType, setImageType] = useState('url') // 'url' ou 'upload'
    const [imageFile, setImageFile] = useState(null) // Pour stocker le fichier uploadé
    const [form, setForm] = useState({
        title: '',
        title_h1: '',
        description: '',
        type: '',
        image: '',
        faqListe: [],
        responsable: userdata.identite,
        meta_title: '',
        meta_description: '',
        indexation: 1,
        content: ''
    });

    useEffect(() => {
        handleType()
        listType()
    }, [])

    const listType = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`);
            if (!response.ok) throw new Error(`Erreur: ${response.status}`);
            const typesData = await response.json();
            setTypes(typesData);
        } catch (e) {
            console.error("Erreur lors de la récupération des types:", e);
        }
    };

    const handleType = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements/${id}`)
            const classement = await response.json()
            setForm({
                title: classement[0].title || '',
                title_h1: classement[0].titre_h1 || '',
                description: classement[0].text || '',
                type: classement[0].type || '',
                image: classement[0].logo || '',
                faqListe: JSON.parse(classement[0].faq) || '',
                responsable: classement[0].responsable || '',
                meta_title: classement[0].meta_title || '',
                meta_description: classement[0].meta_description || '',
                indexation: classement[0].indexation || 1,
                content: classement[0].content
            })
        } catch (e) {
            setMessage(e.response.message.json())
        } finally {
            setLoading(false)
        }
    }

    const submit = async () => {
        if (form.title !== '') {
            const content = editorRef.current.getContent();
            try {
                const formData = new FormData();
                Object.keys(form).forEach(key => {
                    key == 'faqListe' ? formData.append(key, JSON.stringify(form[key])) :
                        formData.append(key, form[key]);
                });
                formData.append('content', JSON.stringify(content))
                if (imageType === 'upload' && imageFile) {
                    formData.append('file', imageFile);
                }
                const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                alert(response.data.message)
                setMessage(response.data.message)
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
            <h1 className='text-center text-2xl font-medium mb-10'>Modifier un classement</h1>
            <div className="space-y-2 text-md text-gray-700 font-medium">
                <div className="sm:mb-5 mb-2">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Type</label>
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className={`${form.type === '' ? 'text-gray-400' : 'text-gray-700'} block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}>
                        <option className='hidden' value="">Type du classement</option>
                        {types.map((type, index) => (
                            <option key={index} className='text-gray-700' value={type.title}>{type.title}</option>
                        ))}
                    </select>
                </div>
                {/* <MyInput label={"Title"} type={'text'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /> */}
                <MyInput onClick={() => alert("Vous ne pouvez plus changer ce champ")} label={"Titre"} type={'text'} readOnly={true} value={form.title} title={"Vous ne pouvez plus changer ce champ"} />
                <MyInput label={"Titre h1"} type={'text'} value={form.title_h1} onChange={(e) => setForm({ ...form, title_h1: e.target.value })} />
                <div className="">
                    <label className=" mb-2 font-medium text-gray-700 ">Description</label>
                    <textarea onChange={(e) => setForm({ ...form, description: e.target.value })} value={form.description} className="mb-5 w-full outline-none border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-700 h-[100px] sm:h-[200px] p-2  " />
                </div>
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
                <AddFaq form={form} setForm={setForm} />
                <Editor
                    // apiKey={TINY_KEY}
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={form.content}
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
                            // "paste",
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
                <button
                    type="submit"
                    onClick={submit}
                    className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
                >
                    Enregistrer les modifications
                </button>
            </div>
            <p className='flex justify-center text-red-400'>{message}</p>
        </div>
    )
}

export default ModifierClassement


export const AddFaq = ({ form, setForm }) => {
    // faq sert à la fois pour l'ajout et l'édition
    const [faq, setFaq] = useState({ question: "", answer: "" });
    // editIndex null signifie qu'on est en mode ajout ; sinon, on modifie la FAQ à cet index
    const [editIndex, setEditIndex] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFaq({ ...faq, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (faq.question.trim() && faq.answer.trim()) {
            if (editIndex !== null) {
                // Mode modification : on met à jour l'élément existant
                const updatedFaqListe = form.faqListe.map((item, index) =>
                    index === editIndex ? faq : item
                );
                setForm({ ...form, faqListe: updatedFaqListe });
                setEditIndex(null);
            } else {
                // Mode ajout : on ajoute la nouvelle FAQ
                setForm({ ...form, faqListe: [...form.faqListe, faq] });
            }
            setFaq({ question: "", answer: "" });
        } else {
            alert("Veuillez remplir tous les champs !");
        }
    };

    const handleDelete = (index) => {
        const updatedList = form.faqListe.filter((_, i) => i !== index);
        setForm({ ...form, faqListe: updatedList });
        // Si on supprime l'élément en cours d'édition, on réinitialise le formulaire
        if (editIndex === index) {
            setEditIndex(null);
            setFaq({ question: "", answer: "" });
        }
    };

    const handleEdit = (index) => {
        const item = form.faqListe[index];
        setFaq(item);
        setEditIndex(index);
    };

    return (
        <div className="p-6 w-full sm:flex justify-between bg-gray-100 rounded-md">
            {/* Formulaire pour ajouter / modifier une FAQ */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold mb-4">
                        {editIndex !== null ? "Modifier une FAQ" : "Ajouter une FAQ"}
                    </h1>
                    <label htmlFor="question" className="block font-medium mb-1">
                        Question
                    </label>
                    <input
                        type="text"
                        id="question"
                        name="question"
                        value={faq.question}
                        onChange={handleChange}
                        placeholder="Entrez une question"
                        className="border rounded p-2 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="answer" className="block font-medium mb-1">
                        Réponse
                    </label>
                    <textarea
                        id="answer"
                        name="answer"
                        value={faq.answer}
                        onChange={handleChange}
                        placeholder="Entrez une réponse"
                        className="border rounded p-2 w-full sm:w-[200px] h-24"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        {editIndex !== null ? "Sauvegarder les modifications" : "Ajouter FAQ"}
                    </button>
                    {editIndex !== null && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditIndex(null);
                                setFaq({ question: "", answer: "" });
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            {/* Liste des FAQs */}
            <div className="mt-5 sm:mt-0">
                <h2 className="text-xl font-bold mb-4">Liste des FAQ</h2>
                {form.faqListe?.length > 0 ? (
                    <ul className="space-y-2 bg-white p-5">
                        {form.faqListe.map((item, index) => (
                            <div key={index} className="flex space-x-2 w-full sm:w-[250px] items-start">
                                <li className="border py-1 px-2 rounded shadow bg-gray-100 flex-1">
                                    <p className="font-semibold">Q: {item.question}</p>
                                    <p className="ml-2">R: {item.answer}</p>
                                </li>
                                <div className="flex flex-col space-y-1">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Aucune FAQ ajoutée pour le moment.</p>
                )}
            </div>
        </div>
    );
};
