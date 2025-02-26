'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MyInput } from '@/app/signup/page';
import { handleImageSelect } from '../LogoutButton';
import { useUser } from './context/UserContext';

const AddClassement = () => {
    const userdata = useUser()
    const [message, setMessage] = useState('');
    const [types, setTypes] = useState([]);
    const [imageType, setImageType] = useState('url') // 'url' ou 'upload'
    const [imageFile, setImageFile] = useState(null) // Pour stocker le fichier uploadé

    const [form, setForm] = useState({
        title: '',
        type: '',
        image: '',
        faqListe: [],
        responsable: userdata.identite,
        meta_title: '',
        meta_description: '',
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
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                key == 'faqListe' ? formData.append(key, JSON.stringify(form[key])) :
                    formData.append(key, form[key]);
            });
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
                type: '',
                image: '',
                faqListe: [],
                responsable: userdata.identite,
                meta_title: '',
                meta_description: '',
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
                <MyInput label={"Title"} type={'text'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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