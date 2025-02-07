import Caracteristiques from '@/components/detail/Caracteristique'
import Description from '@/components/detail/Description'
import { Footer } from '@/components/Footer'
import { Chatbot, Offre } from '@/components/Offre'
import React from 'react'

const page = async ({ params }) => {
    const { offre, produit } = await params
    const nbreOffre = 10
    const [offresRes, alternativeRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?title=${offre}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?produit=${produit}&limit=${nbreOffre}`)
    ])

    const [data, offres] = await Promise.all([offresRes.json(), alternativeRes.json()])

    data.classement = data.classement ? JSON.parse(data.classement) : [];
    data.descriptionOC = data.descriptionOC ? JSON.parse(data.descriptionOC) : [];

    const alternative = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const filters = data.classement

    const filterData = (data, terms) => {
        const matchingItems = data.filter((item) =>
            item.classement.some((term) => terms.includes(term))
        );
        return matchingItems
    };

    const filteredData = filterData(alternative, filters);

    // console.log(filteredData)

    return (
        <>
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
                                    <p className='font-medium text-sm sm:text-md border border-gray-200 px-2 py-1 rounded-full m-2'>
                                        Screen recording
                                    </p>
                                </div>
                            </div>
                            <div className="px-3 py-1 flex flex-wrap gap-2 mt-2">
                                <a
                                    href='https://andy23portfolio.netlify.app/'
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
                    <Caracteristiques data={data} params={produit} />
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
                        DeepSeek est une entreprise chinoise d'intelligence artificielle,
                        fondée en 2023 par Liang Wenfeng, spécialisée dans le développement de modèles de langage open-source.
                        asée à Hangzhou, dans la province du Zhejiang, elle est financée par le fonds spéculatif High-Flyer.
                        cite turn0search26

                        'un de ses modèles phares, DeepSeek-R1, offre des performances comparables à celles de modèles contemporains tels que GPT-4 d'OpenAI,
                        mais avec des coûts de formation significativement réduits.ar exemple,
                        le coût de formation de DeepSeek-R1 est estimé à 6 millions de dollars,
                        contre 100 millions de dollars pour GPT-4 en 2023.cite turn0search26
                        e 10 janvier 2025, DeepSeek a lancé une application de chatbot gratuite basée sur le modèle DeepSeek-R1 pour iOS et Android.n
                        moins de trois semaines, cette application a surpassé ChatGPT en tant qu'application gratuite la plus téléchargée sur l'App Store d'Apple aux États-Unis,
                        provoquant une baisse de 18 % du cours de l'action Nvidia.cite turn0search26
                        algré son succès, DeepSeek a suscité des préoccupations concernant sa conformité aux politiques de censure du gouvernement chinois et ses pratiques de collecte de données,
                        entraînant une surveillance réglementaire dans plusieurs pays.cite turn0search26
                        n résumé, DeepSeek se distingue par ses modèles de langage open-source performants et économes,
                        ainsi que par sa capacité à rivaliser avec des géants technologiques établis, tout en soulevant des questions sur la gouvernance des données et la conformité réglementaire.
                        navlistDeepSeek : Avancées et Controverses dans l'IA Chinoiseturn0news9,turn0news11,turn0news13
                    </p>

                </div>

                {/* Colonne de droite pour les alternatives et Chatbot, centrée */}
                <div className="w-full md:w-1/3 flex flex-col items-center p-5 bg-white">
                    <h1 id='alternative' className='text-blue-700 text-3xl text-center font-bold my-5'>
                        Alternative
                    </h1>
                    <div className="w-full space-y-4">
                        {/* {filteredData.map((item, index) =>
                            <Chatbot key={index} data={item} params={produit} />
                        )} */}
                        <Offre data={filteredData} params={produit} className={true} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page

