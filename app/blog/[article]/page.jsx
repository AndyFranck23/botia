import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import React from 'react'

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
            <div className='text-black lg:px-[250px] px-[15vw] pt-20'>
                <h1 className='text-2xl md:text-4xl text-black text-center font-bold mb-5'>{data[0].title} </h1>
                <div dangerouslySetInnerHTML={{ __html: data[0]?.content || '' }} />
            </div>
            <Footer articles={articles} result={footers} classements={classement} mention={mention[0]} />
        </>
    )
}

export default page