'use client'

import { useRef, useState } from "react"
import axios from "axios"
import { MyInput } from "@/app/signup/page"
import { NOM_DE_DOMAIN } from "../env"
import { slugify } from "../Slug"
import dynamic from "next/dynamic";
import { handleImageBrowser, handleImageSelect } from "../LogoutButton"
import { useUser } from "./context/UserContext"
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });


export default function AddOffre({ classements, TINY_KEY, produit }) {
    const userdata = useUser()
    const editorRef = useRef(null);
    // const [descCourt, setDescCourt] = useState('')
    const [message, setMessage] = useState('')
    const [imageType, setImageType] = useState('url') // 'url' ou 'upload'
    const [imageFile, setImageFile] = useState(null) // Pour stocker le fichier uploadé

    const [form, setForm] = useState({
        title: '',
        slug: '',
        classement: [],
        descriptionOC: '',
        image: '',
        prix: 0,
        reduction: 0,
        lien: '',
        produit: '',
        indexation: 1,
        meta_title: '',
        meta_description: '',
        responsable: userdata.identite
    })

    // const descCourtControle = (e) => {
    //     setDescCourt(e)
    //     let liste = e.split("|")
    //     setForm({ ...form, descriptionOC: liste })
    // }

    const handleCheckboxChange = (event) => {
        const value = JSON.parse(event.target.value); // On parse la valeur en objet avec title et slug

        setForm((prevForm) => {
            // Vérifie si l'élément avec ce slug est déjà dans le classement
            const alreadySelected = prevForm.classement.some(item => item.slug === value.slug);

            return {
                ...prevForm,
                classement: alreadySelected
                    ? prevForm.classement.filter((item) => item.slug !== value.slug) // Supprime si déjà présent
                    : [...prevForm.classement, value], // Ajoute sinon
            };
        });
    };

    const submit = async () => {
        // setForm({ ...form, produit: slugify(form.produit) })
        if ((form.title && form.classement && form.descriptionOC && form.lien) !== '') {
            const content = editorRef.current.getContent();
            try {
                const formData = new FormData();
                Object.keys(form).forEach(key => {
                    key == 'classement' || 'descriptionOC' ? formData.append(key, JSON.stringify(form[key])) :
                        formData.append(key, form[key]);
                });
                formData.append('content', JSON.stringify(content))
                if (imageType === 'upload' && imageFile) {
                    formData.append('file', imageFile);
                }

                const response = await axios.post(`${NOM_DE_DOMAIN}/api/offres`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setMessage(response.data.message)
                setForm({
                    title: '',
                    slug: '',
                    classement: [],
                    descriptionOC: '',
                    image: '',
                    prix: 0,
                    reduction: 0,
                    lien: '',
                    produit: '',
                    indexation: 1,
                    meta_title: '',
                    meta_description: '',
                    // responsable: 
                })
                setImageFile('url')
                alert(response.data.message)
                console.log(response.data.message)
            } catch (e) {
                console.log(e)
                // setMessage(e.response.data.message)
            }
        } else {
            setMessage('Veuillez remplir les champs nécessaires')
        }
    }

    return (
        <div className="text-black">
            <h1 className='flex justify-center text-xl font-medium mb-5'>Ajout d'un offre</h1>
            <div className="sm:mb-5 mb-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Produit</label>
                <select
                    value={form.produit}
                    onChange={(e) => setForm({ ...form, produit: e.target.value })}
                    className={`${form.type === '' ? 'text-gray-400' : 'text-gray-700'} block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}>
                    <option className='hidden' value="">Produit ou l'offre appartient</option>
                    {produit.map((type, index) => (
                        <option key={index} className='text-gray-700' value={type.title}>{type.title}</option>
                    ))}
                </select>
            </div>
            <MyInput type={'text'} label={'Titre'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} />

            <MyInput type={'text'} label={'Description court'} value={form.descriptionOC} onChange={(e) => setForm({ ...form, descriptionOC: e.target.value })} />

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
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500">
                                        Choisir une image
                                    </button> :
                                    <MyInput type={'text'} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                            }
                        </div>
                    )}
                </div>
            </div>

            <MyInput type={'number'} label={'Prix'} value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} />

            <MyInput type={'number'} label={'Reduction'} value={form.reduction} onChange={(e) => setForm({ ...form, reduction: e.target.value })} />
            <MyInput placeholder={'https://exemple.com'} type={'text'} label={'Lien principale'} value={form.lien} onChange={(e) => setForm({ ...form, lien: e.target.value })} />
            <Editor
                apiKey={TINY_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue="<p>Écris ici...</p>"
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
            <label className="block text-gray-700 font-medium mb-2 text-md border-t-2 border-gray-200">Classements: </label>
            <div className='text-black flex flex-wrap justify-center'>
                {
                    classements.map((item, index) =>
                        <div key={index} className=" px-10">
                            <p className='text-blue-500 text-xl' >{item.title} </p>
                            <div className="ml-10 font-medium text-md text-gray-700">
                                {
                                    item.classement.map((elt, i) =>
                                        elt.type == item.title ?
                                            <div key={i} className="flex items-center   ">
                                                <input
                                                    type="checkbox"
                                                    value={JSON.stringify({ title: elt.title, slug: slugify(elt.title) })}
                                                    className="mr-2"
                                                    checked={form.classement.some((item) => item.slug === slugify(elt.title))}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <p>{elt.title}</p>
                                            </div>
                                            : undefined
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <button onClick={submit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 mt-10">
                Ajouter
            </button>
            <p className='mt-5 flex justify-center text-red-400'>{message}</p>
        </div>
    )
}