'use client'

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { MyInput } from "./SignUp";
import { handleImageBrowser, handleImageSelect } from '../LogoutButton';
import { useUser } from './context/UserContext';


import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });

const AddClassement = ({ type, TINY_KEY }) => {
    const editorRef = useRef(null);
    const userdata = useUser()
    const [message, setMessage] = useState('');
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
    });

    useEffect(() => {
        listType();
    }, []);

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

    const submit = async () => {
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
            alert(response.data.message);
            setImageFile('url')
        } catch (e) {
            console.error("Erreur lors de la soumission :", e);
            setMessage(e.response?.data?.message || "Erreur de connexion");
        } finally {
            setForm({
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
            });
        }
    };

    return (
        <div className='text-black'>
            <h1 className='text-center text-2xl font-medium mb-10'>Ajouter un classement</h1>
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
                <MyInput label={"Titre"} type={'text'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
                    initialValue={"<p>Ecrire ici...</p>"}
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
                    Créer le classement
                </button>
            </div>
            <p className='flex justify-center text-red-400'>{message}</p>
        </div>
    );
};

export default AddClassement;



const AddFaq = ({ form, setForm }) => {
    const [faq, setFaq] = useState({ question: "", answer: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFaq({ ...faq, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (faq.question.trim() && faq.answer.trim()) {
            setForm({ ...form, faqListe: [...form.faqListe, faq] });
            setFaq({ question: "", answer: "" });
        } else {
            alert("Veuillez remplir tous les champs !");
        }
    };

    const handleDelete = (index) => {
        const updatedList = form.faqListe.filter((_, i) => i !== index);
        setForm({ ...form, faqListe: updatedList });
    };

    return (
        <div className="p-6 w-full sm:flex justify-between bg-gray-100 rounded-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Ajouter une FAQ</h1>
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

                <button
                    type="submit"
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
                >
                    Ajouter FAQ
                </button>
            </form>

            <div className="mt-5 sm:mt-0">
                <h2 className="text-xl font-bold mb-4">Liste des FAQ</h2>
                {form.faqListe.length > 0 ? (
                    <ul className="space-y-2 bg-white p-5">
                        {form.faqListe.map((item, index) => (
                            <div key={index} className="flex space-x-2 w-full sm:w-[250px]">
                                <li className="border py-1 px-2 rounded shadow bg-gray-100">
                                    <p className="font-semibold">Q: {item.question}</p>
                                    <p className="ml-2">R: {item.answer}</p>
                                </li>
                                <div>
                                    <button className='text-blue-500'>Modifier</button>
                                    <button className='text-red-500' onClick={() => handleDelete(index)}>Supprimer</button>
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