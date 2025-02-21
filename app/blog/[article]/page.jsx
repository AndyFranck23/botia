import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import React from 'react'

const page = async ({ params }) => {
    const { article } = await params
    const [typesRes, classementsRes, produitsRes, articlesRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/blog`),
    ])

    const [types, classements, produits, articles] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json()])
    const classement = types.map(category => ({
        ...category,
        classement: classements.filter(item => item.type === category.title)
    }));

    const data = articles?.filter(item => item.slug === article)

    return (
        <>
            <Header classement={classement} produits={produits} />
            <div className='text-black p-5 pt-20'>
                <div dangerouslySetInnerHTML={{ __html: data[0]?.content || '' }} />
            </div>
            <Footer articles={articles} />
        </>
    )
}

export default page