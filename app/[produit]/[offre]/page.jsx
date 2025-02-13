import Caracteristiques from '@/components/detail/Caracteristique'
import Description from '@/components/detail/Description'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Chatbot } from '@/components/Offre'
import React from 'react'

export async function generateMetadata({ params }) {
    const { offre } = await params
    const response = await fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?slug=${offre}`)
    const data = await response.json()
    return {
        title: data.title,
        description: JSON.parse(data.descriptionOC),
        robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
    }
}

const page = async ({ params }) => {
    const { offre, produit } = await params
    const nbreOffre = 10
    const [offresRes, alternativeRes, typesRes, classementsRes, produitsRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?slug=${offre}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?produit=${produit}&limit=${nbreOffre}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`),
    ])

    const [data, offres, types, classe, produits] = await Promise.all([offresRes.json(), alternativeRes.json(), typesRes.json(), classementsRes.json(), produitsRes.json()])

    data.classement = data.classement ? JSON.parse(data.classement) : [];
    data.descriptionOC = data.descriptionOC ? JSON.parse(data.descriptionOC) : [];

    const alternative = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const classements = types.map(category => ({
        ...category,
        classement: classe.filter(item => item.type === category.title)
    }));

    const filters = data.classement

    // const filterData = (data, terms) => {
    //     const matchingItems = data.filter((item) =>
    //         item.classement.some((term) => terms.includes(term))
    //     );
    //     return matchingItems
    // };

    const filterData = (data, terms) => {
        return data.filter((item) =>
            item.classement.some((term) =>
                terms.some((t) => t.id === term.id) // Comparaison basée sur un identifiant unique
            )
        );
    };


    const filteredData = filterData(alternative, filters);

    // console.log(filteredData)

    return (
        <>
            <Header params={produit} classement={classements} home={true} produits={produits} />
            <div className="pt-10">
                <div id='head' className=""></div>
                {/* Conteneur principal avec deux colonnes sur md et plus */}
                <div className="w-full md:flex mt-5 bg-white">
                    {/* Colonne de gauche pour les détails */}
                    <div className="w-full md:w-2/3 border-r border-gray-200 p-5">
                        <div className="border-b border-gray-200 pb-5">
                            <div className="w-full">
                                <div className="flex items-center px-3 pt-3">
                                    <img src={data.image} alt={data.title} className='mr-3 w-16 h-16 rounded-xl' />
                                    <div>
                                        <h1 className='text-2xl text-gray-900 font-bold m-2'>{data.title}</h1>
                                        <p className='font-medium text-sm bg-gray-100 max-w-[200px] text-gray-700 px-3 py-1 rounded-full inline-block'>
                                            {data.descriptionOC}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 flex flex-wrap gap-2 mt-2">
                                    <a
                                        href={data.lien}
                                        className='bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white'
                                    >
                                        Voir le prestataire
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className='pt-4'>
                            <img src={data.image} alt="Illustration" className="w-full rounded-md h-[400px] sm:h-[500px]  sm:w-full " />
                        </div>
                        <Caracteristiques data={data} params={produit} classements={classements} />
                        <Description />
                        <div className='p-5 space-y-3'>
                            <button className='bg-blue-800 hover:bg-blue-900 rounded-lg text-white py-3 w-full'>
                                Use tools
                            </button>
                            <button className='bg-white border border-blue-600 hover:bg-blue-50 rounded-lg text-blue-600 py-3 w-full'>
                                Save
                            </button>
                            <button className='bg-blue-500 hover:bg-blue-600 rounded-lg text-white py-3 w-full'>
                                Vote Best AI Tool of 2024
                            </button>
                        </div>

                        <p>
                            {data.descriptionOD}
                        </p>

                    </div>

                    {/* Colonne de droite pour les alternatives et Chatbot, centrée */}
                    <div className="w-full md:w-1/3 flex flex-col items-center p-5 bg-white">
                        <h2 id='alternative' className='text-blue-700 text-3xl text-center font-bold my-5'>
                            Alternative
                        </h2>
                        <div className="w-full space-y-4">
                            {filteredData.map((item, index) =>
                                <Chatbot key={index} data={item} params={produit} classements={classements} />
                            )}
                            {/* <Offre data={filteredData} params={produit} className={true} /> */}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page

