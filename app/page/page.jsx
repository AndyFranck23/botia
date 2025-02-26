import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import React from 'react'

const page = async () => {
    const [typesRes, classementsRes, produitsRes, articlesRes, mentionRes, footerRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
    ])

    const [types, classements, produits, articles, mention, footers] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), mentionRes.json(), footerRes.json()])
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
            <Footer articles={articles} result={footers} classements={classement} mention={mention[0]} />
        </>
    )
}

export default page