import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import React from 'react'

const page = async () => {
    const [typesRes, classementsRes, produitsRes, articlesRes, mentionRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/blog`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/mention`),
    ])

    const [types, classements, produits, articles, mention] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), mentionRes.json()])
    const classement = types.map(category => ({
        ...category,
        classement: classements.filter(item => item.type === category.title)
    }));

    return (
        <>
            <Header classement={classement} produits={produits} />
            <div className='text-black p-5 pt-20'>
                <div dangerouslySetInnerHTML={{ __html: mention[0]?.content || '' }} />
            </div>
            <Footer articles={articles} />
        </>
    )
}

export default page