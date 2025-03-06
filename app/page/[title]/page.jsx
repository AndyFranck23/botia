import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

export async function generateMetadata({ params }) {
    const { title } = await params

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/page?slug=${title}`)
    const data = await response.json()

    return {
        title: data[0]?.meta_title == undefined || '' ? data[0].title != undefined ? data[0].title : 'Page non trouvé' : data[0].meta_title,
        description: data[0]?.meta_description,
        robots: data[0]?.indexation == 0 ? "noindex, nofollow" : "index, follow"
    }
}

const page = async ({ params }) => {
    const { title } = await params
    const [typesRes, classementsRes, produitsRes, pagesRes, footerRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/page?slug=${title}`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
    ])

    const [types, classements, produits, pages, footers] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), pagesRes.json(), footerRes.json()])
    const classement = types.map(category => ({
        ...category,
        classement: classements.filter(item => item.type === category.title)
    }));

    const data = pages?.filter(item => item.slug === title)

    return (
        <>
            <Header classement={classement} produits={produits} />
            <div className='text-black pt-20'>
                <h1 className='text-2xl md:text-4xl text-black text-center font-bold mb-5'>{data[0]?.title} </h1>
                <div className="xs:px-[5vw] px-[20px] w-full justify-center flex">
                    {data[0]?.content ? (
                        <div className="overflow-x-auto prose max-w-none">
                            <div className="no-tailwind" dangerouslySetInnerHTML={{ __html: data[0]?.content }} />
                        </div>
                    ) : (
                        <p>Contenu indisponible.</p>
                    )}
                </div>
            </div>
            <Footer pages={pages} result={footers} classements={classement} />
        </>
    )
}

export default page