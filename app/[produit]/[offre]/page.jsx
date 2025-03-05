import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import { ButtonClick } from '@/components/LogoutButton'
import { Chatbot } from '@/components/Offre'
import Link from 'next/link'
import React from 'react'

export async function generateMetadata({ params }) {
    const { offre } = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?slug=${offre}`)
    const data = await response.json()
    // data.descriptionOC = JSON.stringify(data.descriptionOC)
    return {
        title: data?.meta_title?.trim() ? data.meta_title : data?.title,
        description: data?.meta_description?.trim() ? data.meta_description : data?.descriptionOC,
        robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
    }
}

const page = async ({ params }) => {
    const { offre, produit } = await params
    const nbreOffre = 10 // nombre d'offres dans les alternatives
    const [offresRes, alternativeRes, typesRes, classementsRes, produitsRes, articlesRes, footerRes, mentionRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?slug=${offre}`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?limit=${nbreOffre}`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`),
    ])

    const [data, { offres }, types, classe, produits, articles, footers, mention] = await Promise.all([offresRes.json(), alternativeRes.json(), typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), footerRes.json(), mentionRes.json()])

    data.classement = data.classement ? JSON.parse(data.classement) : [];
    // data.descriptionOC = data.descriptionOC ? JSON.parse(data.descriptionOC) : [];

    const alternative = (offres || []).map((item) => ({
        ...item,
        classement: item.classement ? JSON.parse(item.classement) : [],
        // descriptionOC: JSON.parse(item.descriptionOC),
    }));


    const classements = types.map(category => ({
        ...category,
        classement: classe.filter(item => item.type === category.title)
    }));

    const filters = data.classement

    const filterData = (data, terms) => {
        return data.filter((item) =>
            item.classement.some((term) =>
                terms.some((t) => t.id === term.id) // Comparaison basée sur un identifiant unique
            )
        );
    };

    const filteredData = filterData(alternative, filters);

    return (
        <>
            <Header classement={classements} produits={produits} />
            <div className="pt-10">
                <div className="w-full lg:flex mt-10 bg-white shadow-lg rounded-lg ">
                    <div className="w-full lg:w-2/3 border-r border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-6">
                            <div className="flex items-center px-3 pt-3 pb-4">
                                <img src={data?.image ? data?.image : data?.title} className='mr-4 w-20 h-20 rounded-xl shadow-md object-cover' />
                                <div>
                                    <h1 className='text-3xl sm:text-4xl text-gray-900 font-extrabold m-2'>{data?.title}</h1>
                                    <p className='font-medium text-lg text-gray-700 px-4 py-2 rounded-md inline-block'>
                                        {data?.descriptionOC}
                                    </p>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit} className="bg-gray-100 p-2 rounded-xl border font-bold text-green-600 justify-self-start">{data.id_produit}</Link>
                                <ButtonClick
                                    href={data?.lien.startsWith("http://") || data?.lien.startsWith("https://") ? data?.lien : '#'}
                                    data={data}
                                />
                            </div>
                            <div className='flex flex-wrap m-3 gap-4'>
                                {
                                    data?.classement.map((item, index) =>
                                        <Link key={index} href={navigation(item, classements)} className='px-3 py-1 text-sm border-2 border-blue-200 text-blue-600 rounded-full group-hover:border-white/50 group-hover:text-white hover:bg-blue-600 hover:text-white transition-all'>{item.title} </Link>
                                    )}
                            </div>
                            <p className=' text-red-600 font-bold text-4xl p-1'>A partir de: {data?.prix}</p>
                        </div>
                        <div className='pt-6'>
                            <img src={data?.image ? data?.image : data?.title} alt="Illustration" className="w-full rounded-md h-[400px] sm:h-[500px] object-cover shadow-md" />
                        </div>
                        <div className='xs:px-[5vw] px-[5px] rounded-md mt-6 '>
                            <h2 className="text-xl font-semibold mb-4">{data?.title}</h2>
                            {data?.content && (
                                <div className="overflow-x-auto prose max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 flex flex-col items-center mx-auto p-6 bg-gray-50">
                        {/* Section Titre */}
                        <h2 id="alternative" className="text-blue-700 text-3xl font-bold text-center mb-4">
                            Alternative
                        </h2>

                        {/* Section des chatbots */}
                        <div className="w-full flex flex-col items-center gap-y-4">
                            {filteredData.map((item, index) => (
                                <div key={index} className="w-full flex flex-wrap justify-center">
                                    <Chatbot produits={produits} data={item} params={produit} classements={classements} className={"lg:w-full w-[400px]"} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <Footer articles={articles} result={footers} classements={classements} mention={mention[0]} />
        </>
    )
}

export default page

const navigation = (pageName, classements) => {
    let out = '';
    classements.forEach((element) => {
        element.classement.forEach((ele) => {
            if (ele.title === pageName.title) {
                out = element.title;
            }
        });
    });
    return process.env.NEXT_PUBLIC_SITE_URL + "/class" + "/" + out.toLowerCase() + "/" + pageName.slug;
};