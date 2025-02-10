'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import { MyInput } from "@/app/signup/page"
import { NOM_DE_DOMAIN } from "../env"
import { slugify } from "../Slug"

export default function ModifierOffre({ id, classements }) {
    const [descCourt, setDescCourt] = useState('')
    const [message, setMessage] = useState('')
    const [produit, setProduit] = useState([])
    const [form, setForm] = useState({
        title: '',
        slug: '',
        classement: [],
        descriptionOC: [],
        image: '',
        prix: 0,
        reduction: 0,
        lien: '',
        descriptionOD: '',
        produit: ''
    })
    const [odActive, setOdActive] = useState(form.descriptionOD == '' ? false : true)

    useEffect(() => {
        fetchProduit()
        offre()
    }, [])

    const fetchProduit = async () => {
        try {
            const response = await fetch(`${NOM_DE_DOMAIN}/api/produit`)
            const data = await response.json()
            setProduit(data)
        } catch (err) {
            setMessage('tsy mety')
        }
    }

    const offre = async () => {
        try {
            const response = await fetch(`${NOM_DE_DOMAIN}/api/offres/${id}`)
            const offre = await response.json()

            let description = ''
            JSON.parse(offre[0].descriptionOC).forEach((elt, index) => {
                if (index == JSON.parse(offre[0].descriptionOC).length - 1)
                    description = description + elt
                else
                    description = elt + "|" + description
            })

            descCourtControle(description)
            let desc = description.split("|")
            setForm({
                title: offre[0].title,
                slug: offre[0].slug,
                classement: JSON.parse(offre[0].classement),
                descriptionOC: desc,
                image: offre[0].image,
                prix: offre[0].prix,
                reduction: offre[0].reduction,
                lien: offre[0].lien,
                produit: offre[0].id_produit
            })
            console.log(offre[0].id_produit)
            if (offre[0].descriptionOD != '')
                setOdActive(true)
        } catch (e) {
            console.log(e)
            setMessage(e.response.data.message)
        }
    }

    const descCourtControle = (e) => {
        setDescCourt(e)
        let liste = e.split("|")
        setForm({ ...form, descriptionOC: liste })
    }

    const submit = async () => {
        if ((form.title && form.classement && form.descriptionOC && form.image && form.lien) !== '') {
            try {
                const response = await axios.put(`${NOM_DE_DOMAIN}/api/offres/${id}`, { form })
                // console.log(response.data.message)
                setMessage(response.data.message)
            } catch (err) {
                console.log(err.message)
            }
        } else {
            setMessage('Veuillez remplir les champs nécessaires')
        }
    }

    // Fonction pour gérer les changements
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

    return (
        <div className="text-black">
            <h1 className='flex justify-center text-xl font-medium mb-5'>Modifier un offre</h1>
            <div className="sm:mb-5 mb-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">Produit</label>
                <select
                    value={form.produit}
                    onChange={(e) => setForm({ ...form, produit: e.target.value })}
                    className={`${form.type === '' ? 'text-gray-400' : 'text-gray-700'} block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}>
                    {/* <option className='hidden' value="">Produit ou l'offre appartient</option> */}
                    {produit.map((type, index) => (
                        <option key={index} className='text-gray-700' value={type.title}>{type.title}</option>
                    ))}
                </select>
            </div>
            <MyInput type={'text'} label={'Titre'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} />

            <MyInput type={'text'} label={'Description court'} value={descCourt} onChange={(e) => descCourtControle(e.target.value)} />

            <MyInput type={'text'} label={"URL de l'image"} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <MyInput type={'number'} label={'Prix'} value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} />

            <MyInput type={'number'} label={'Reduction'} value={form.reduction} onChange={(e) => setForm({ ...form, reduction: e.target.value })} />
            <MyInput placeholder={'https://exemple.com'} type={'text'} label={'Lien principale'} value={form.lien} onChange={(e) => setForm({ ...form, lien: e.target.value })} />
            <div className="items-center flex justify-between p-3">
                <label className=" mb-2 font-medium text-gray-700 ">Ajouter un OD :</label>
                <input
                    type="checkbox"
                    className="border"
                    checked={odActive}
                    onChange={(e) => setOdActive(!odActive)}
                />
            </div>
            {
                odActive &&
                <div className="">
                    <textarea onChange={(e) => setForm({ ...form, descriptionOD: e.target.value })} value={form.descriptionOD} className="mb-5 w-full outline-none border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-700 h-[100px] sm:h-[200px] p-2  " />
                </div>
            }
            <label className="block text-gray-700 font-medium mb-2 text-md border-t-2 border-gray-200">Classements: </label>
            {/* selection de classement */}
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
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                Modifier
            </button>
            <p className='mt-5 flex justify-center text-red-400'>{message}</p>
        </div>
    )
}
