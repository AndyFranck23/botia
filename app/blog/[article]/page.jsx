import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

export async function generateMetadata({ params }) {
    const { article } = await params

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?slug=${article}`)
    const data = await response.json()

    return {
        title: data[0].meta_title == '' ? data[0].title : data[0].meta_title,
        description: data[0].meta_description,
        // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
        robots: data[0].indexation == 0 ? "noindex, nofollow" : "index, follow"
    }
}

const page = async ({ params }) => {
    const { article } = await params
    const [typesRes, classementsRes, produitsRes, articlesRes, footerRes, mentionRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`),
    ])

    const [types, classements, produits, articles, footers, mention] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), footerRes.json(), mentionRes.json()])
    const classement = types.map(category => ({
        ...category,
        classement: classements.filter(item => item.type === category.title)
    }));

    const data = articles?.filter(item => item.slug === article)

    return (
        <>
            <Header classement={classement} produits={produits} />
            <div className='text-black lg:px-[200px] px-[12vw] pt-20 flex justify-center'>
                <div className="">
                    <h1 className='text-2xl md:text-4xl text-black text-center font-bold mb-5'>{data[0].title} </h1>
                    <div dangerouslySetInnerHTML={{ __html: data[0]?.content || '' }} />
                </div>
            </div>
            <Footer articles={articles} result={footers} classements={classement} mention={mention[0]} />
        </>
    )
}

export default page