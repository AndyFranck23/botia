'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MyInput } from '@/app/signup/page'
import { NOM_DE_DOMAIN } from '../env'

const ModifierClassement = ({ id, userdata }) => {
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({
        title: '',
        type: '',
        logo: '',
        responsable: userdata.identite,
        faqListe: []
    });

    useEffect(() => {
        handleType()
        listType()
    }, [])

    const listType = async () => {
        try {
            const response = await fetch(`${NOM_DE_DOMAIN}/api/types`);
            if (!response.ok) throw new Error(`Erreur: ${response.status}`);
            const typesData = await response.json();
            setTypes(typesData);
        } catch (e) {
            console.error("Erreur lors de la récupération des types:", e);
        }
    };

    const handleType = async () => {
        try {
            const response = await fetch(`${NOM_DE_DOMAIN}/api/classements/${id}`)
            const classement = await response.json()
            setForm({
                title: classement[0].title,
                type: classement[0].type,
                logo: classement[0].logo,
                responsable: classement[0].responsable,
                faqListe: JSON.parse(classement[0].faq)
            })
        } catch (e) {
            setMessage(e.response.message.json())
        } finally {
            setLoading(false)
        }
    }

    const submit = async () => {
        if (form.title !== '') {
            try {
                const response = await axios.put(`${NOM_DE_DOMAIN}/api/classements/${id}`, { form })
                setMessage(response.data.message)
                console.log(response.data)
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
                <MyInput label={"Title"} type={'text'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <MyInput label={"URL du logo"} type={'text'} value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
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
                <AddFaq form={form} setForm={setForm} />
                <button
                    type="submit"
                    onClick={submit}
                    className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
                >
                    Modifier le classement
                </button>
            </div>
            <p className='flex justify-center text-red-400'>{message}</p>
        </div>
    )
}

export default ModifierClassement

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